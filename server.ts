import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// API route for AI Driver Trip Strategy
app.post('/api/analyze-trip', async (req, res) => {
  try {
    const { query, language, vehicleType, currentRules } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Return high quality heuristic response when no API key is supplied
      const heuristicAnswer = language === 'bn'
        ? `🚗 **পরামর্শ (${vehicleType}):**
১. পিক আওয়ার বা বৃষ্টির সময় ন্যূনতম ভাড়া ₹${(currentRules?.minFare || 100) + 30} এবং প্রতি কিমি রেট ₹${(currentRules?.minFarePerKm || 20) + 6}/কিমি রাখা সবচেয়ে লাভজনক।
২. এয়ারপোর্ট বা দূরবর্তী হাইওয়ে ট্রিপের ক্ষেত্রে যদি ফিরতি যাত্রী না পাওয়ার আশঙ্কা থাকে, তবে ন্যূনতম ৩০% সার্জ ছাড়া এক্সেপ্ট করবেন না।
৩. পিকআপ দূরত্ব সবসময় ২.৫ কিমির নিচে রাখুন যাতে আনপেইড ফুয়েল অপচয় না হয়।`
        : `🚗 **Strategy Recommendation (${vehicleType}):**
1. During peak hours or rain, increase minimum fare by ₹30 and per-km rate by ₹6/km for optimal margins.
2. For highway/airport trips with high deadhead risk, require at least a 1.3x surge multiplier to cover empty return mileage.
3. Keep max pickup distance under 2.5 km to prevent wasting uncompensated fuel.`;

      return res.json({ answer: heuristicAnswer });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are RidePilot AI, an expert ride-hailing strategy consultant for Uber, Rapido, and Ola drivers in India/South Asia.
Provide concise, highly practical, bullet-pointed earnings advice for drivers.
Vehicle: ${vehicleType}.
Language: Respond entirely in ${language === 'bn' ? 'Bengali (বাংলা)' : 'English'}.
Keep response under 150 words with actionable numbers (fares, km rates, fuel math).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nDriver Question: ${query}\nCurrent Driver Filter Rules: ${JSON.stringify(currentRules)}` }],
        },
      ],
    });

    res.json({ answer: response.text || '' });
  } catch (error: unknown) {
    console.error('Error generating AI trip advice:', error);
    res.status(500).json({ error: 'Failed to generate advice' });
  }
});

// API endpoint to download the entire application & APK build package as a ZIP file
app.get('/api/download-zip', async (_req, res) => {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const JSZip = (await import('jszip')).default;

    const zip = new JSZip();

    // Helper to add files recursively
    async function addFolderToZip(folderPath: string, zipFolder: InstanceType<typeof JSZip>) {
      const entries = await fs.readdir(folderPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(folderPath, entry.name);
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') {
          continue;
        }
        if (entry.isDirectory()) {
          const subZip = zipFolder.folder(entry.name);
          if (subZip) {
            await addFolderToZip(fullPath, subZip);
          }
        } else if (entry.isFile()) {
          const content = await fs.readFile(fullPath);
          zipFolder.file(entry.name, content);
        }
      }
    }

    // Add root source files
    const rootFiles = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'server.ts',
      'index.html',
      'metadata.json',
      '.env.example',
    ];

    for (const f of rootFiles) {
      try {
        const content = await fs.readFile(f);
        zip.file(f, content);
      } catch {}
    }

    // Add src and public directories
    const srcZip = zip.folder('src');
    if (srcZip) await addFolderToZip('src', srcZip);

    const publicZip = zip.folder('public');
    if (publicZip) await addFolderToZip('public', publicZip);

    // Add Android APK & Capacitor / TWA configuration bundle
    const androidBundle = zip.folder('android-apk-package');
    if (androidBundle) {
      androidBundle.file(
        'capacitor.config.json',
        JSON.stringify(
          {
            appId: 'com.ridepilot.driver',
            appName: 'RidePilot',
            webDir: 'dist',
            bundledWebRuntime: false,
            android: {
              allowMixedContent: true,
              captureInput: true,
              webContentsDebuggingEnabled: true,
            },
          },
          null,
          2
        )
      );

      androidBundle.file(
        'AndroidManifest.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.ridepilot.driver">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="RidePilot"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.DeviceDefault.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
      );

      androidBundle.file(
        'HOW_TO_GENERATE_APK.md',
        `# RidePilot - Android APK Build & Installation Guide

There are 3 fast ways to get this app onto your Android phone as an APK:

---

## Method 1: Instant Native WebAPK (No Coding Required)
1. Open this app's URL on Chrome on your Android smartphone.
2. Tap the browser menu (⋮) or the "অ্যান্ড্রয়েড অ্যাপ ইনস্টল করুন" (Install App) button inside the app.
3. Tap **"Install"** or **"Add to Home Screen"**.
4. Android creates a native WebAPK with full standalone mode, app launcher icon, and splash screen!

---

## Method 2: Convert to Standalone APK with PWABuilder (1-Click)
1. Go to https://www.pwabuilder.com
2. Enter your live app URL.
3. Click **"Package for Android"**.
4. Download the signed **.APK** or **.AAB** package and install it on your device!

---

## Method 3: Build Offline APK via Capacitor / Android Studio
Run the following in the project root:
\`\`\`bash
npm install
npm run build
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init RidePilot com.ridepilot.driver --web-dir dist
npx cap add android
npx cap open android
\`\`\`
Then click **Build > Build Bundle(s) / APK(s) > Build APK(s)** in Android Studio.
`
      );
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="RidePilot-App-Source-and-APK-Package.zip"');
    res.setHeader('Content-Length', zipBuffer.length);
    res.send(zipBuffer);
  } catch (error) {
    console.error('Failed to create zip download:', error);
    res.status(500).json({ error: 'Failed to generate ZIP file' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
