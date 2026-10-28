export type Language = 'bn' | 'en';

export const translations = {
  bn: {
    appTitle: 'RidePilot',
    appSubtitle: 'ড্রাইভার অটো-এক্সেপ্ট ও স্মার্ট ট্রিপ ফিল্টার',
    bilingualNotice: 'বাংলা / English',
    simulatorDisclaimer: 'এটি আপাতত সেটিংসের নমুনা। এই বোতাম Rapido বা Uber-এ বাস্তবে অর্ডার Accept করে না। আপনি কোনটি চান?',
    disclaimerBadge: 'সিমুলেশন ও ট্রেইনিং মোড',
    learnMore: 'বাস্তবে কীভাবে কাজ করে জানুন',

    // Nav / Modes
    modeRules: 'ফিল্টার সেটিংস',
    modeSimulator: 'লাইভ রাইড রাডার',
    modeOverlay: 'স্ক্রিন ওভারলে প্রিভিউ',
    modeCalculator: 'তেল ও লাভ হিসাব',
    modeAnalytics: 'শিফট ও ট্রিপ হিস্ট্রি',
    modeAiAdvisor: 'AI ট্রিপ অ্যানালাইজার',

    // Core Settings requested by user
    autoAcceptTitle: 'অটোমেটিক রাইড গ্রহণ',
    autoAcceptDesc: 'শর্ত পূরণকারী রাইড স্ক্রিনে আসা মাত্রই নিজে থেকে রিকোয়েস্ট এক্সেপ্ট হবে',
    minFareLabel: 'ন্যূনতম ভাড়া (₹)',
    minFareHelp: 'এর চেয়ে কম মোট ভাড়ার কোনো ট্রিপ গ্রহণযোগ্য হবে না',
    minFarePerKmLabel: 'ন্যূনতম ভাড়া প্রতি কিমি (₹)',
    minFarePerKmHelp: 'প্রতি কিলোমিটার ভাড়ার হার (মোট ভাড়া ÷ ট্রিপ দূরত্ব)',
    maxPickupDistanceLabel: 'সর্বোচ্চ পিকআপ দূরত্ব (কিমি)',
    maxPickupDistanceHelp: 'প্যাসেঞ্জার পিকআপ করতে আপনি সর্বোচ্চ কতদূর যেতে চান',

    // Secondary filters
    minRatingLabel: 'ন্যূনতম যাত্রী রেটিং (★)',
    paymentModeLabel: 'পেমেন্ট মাধ্যম',
    allowCashOnly: 'অনলাইন + ক্যাশ উভয়',
    onlineOnly: 'শুধু অনলাইন (ক্যাশহীন)',
    platformsLabel: 'সক্রিয় প্ল্যাটফর্ম',
    vehicleTypesLabel: 'গাড়ির ক্যাটাগরি',
    dropZoneFilters: 'ড্রপ লোকেশন সুরক্ষা',
    excludedAreas: 'যেসব এলাকায় যাবেন না (Blacklist)',
    preferredAreas: 'পছন্দের এলাকা (Hotspots)',

    // Simulator controls
    startSimulation: 'লাইভ রাইডার রাডার চালু করুন',
    stopSimulation: 'রাডার বন্ধ করুন',
    generateSampleRide: 'টেস্ট রিকোয়েস্ট পাঠান',
    dispatcherStatusActive: 'রাডার সক্রিয় · নতুন ট্রিপের সন্ধান চলছে',
    dispatcherStatusPaused: 'রাডার স্থগিত রয়েছে',
    secondsLeft: 'সেকেন্ড বাকি',
    incomingRideAlert: 'নতুন ট্রিপ রিকোয়েস্ট এসেছে!',
    autoAcceptedBanner: 'শর্ত পূরণ হওয়ায় স্বয়ংক্রিয়ভাবে রাইড গ্রহণ করা হয়েছে!',
    rejectedBanner: 'শর্ত না মেলায় ট্রিপ প্রত্যাখ্যান করা হয়েছে',
    manuallyAcceptedBanner: 'আপনি সফলভাবে ট্রিপটি গ্রহণ করেছেন',

    // Metrics & Card info
    pickupDist: 'পিকআপ দূরত্ব',
    tripDist: 'ভ্রমণ দূরত্ব',
    estFare: 'ভাড়া',
    ratePerKm: 'প্রতি কিমি',
    passenger: 'যাত্রী',
    rating: 'রেটিং',
    profitEstimate: 'আনুমানিক নিট লাভ',
    fuelEstimate: 'জ্বালানি খরচ',
    acceptRide: 'রাইড গ্রহণ করুন',
    rejectRide: 'প্রত্যাখ্যান করুন',
    reasonsFailed: 'যেসব শর্ত পূরণ হয়নি',

    // Vehicles
    bike: 'বাইক / মোটো',
    auto: 'অটো / রিকশা',
    cabMini: 'মিনি / হ্যাচব্যাক',
    cabSedan: 'সেডান / প্রিমিয়াম',
    cabEv: 'বৈদ্যুতিক ট্যাক্সি (EV)',

    // Fuel Calculator
    fuelPrice: 'জ্বালানি মূল্য (প্রতি লি/কেজি)',
    vehicleMileage: 'মাইলেজ (কিমি/লিটার)',
    platformFee: 'কোম্পানি কমিশন (%)',
    grossEarnings: 'মোট আয়',
    fuelExpense: 'মোট জ্বালানি ব্যয়',
    netTakeHome: 'পকেটের নিট লাভ',
    effectivePerKm: 'কার্যকরী নিট আয়/কিমি',

    // Sound & System
    soundEffects: 'সাউন্ড ইফেক্টস',
    soundOn: 'চালু',
    soundOff: 'বন্ধ',
    resetDefaults: 'ডিফল্ট সেটিংসে ফিরুন',
    exportReport: 'রিপোর্ট এক্সপোর্ট করুন',
    clearHistory: 'লগ মুছুন',

    // Explainer Modal
    guideTitle: 'Uber ও Rapido-তে বাস্তবে কীভাবে কাজ করে?',
    guideSection1Title: '১. এই ডেমো অ্যাপটি কী?',
    guideSection1Body: 'এটি একটি লার্নিং ও প্র্যাকটিস সিমুলেটর। এখানে আপনি বিভিন্ন ভাড়ার হার ও পিকআপ দূরত্বের শর্ত সেট করে পরীক্ষা করতে পারেন কোন কোন রাইডে আপনার সবচেয়ে বেশি লাভ থাকবে। এটি সরাসরি Uber/Rapido API-এর সাথে সংযুক্ত নয়।',
    guideSection2Title: '২. ড্রাইভাররা বাস্তবে কীভাবে অটো-এক্সেপ্ট করেন?',
    guideSection2Body: 'বাস্তবে অ্যান্ড্রয়েড অপারেটিং সিস্টেমে Accessibility Service এবং Screen Overlay ব্যবহার করে থার্ড-পার্টি অ্যাসিস্ট্যান্ট টুল (যেমন Maxymo বা Driver Utility Helper) স্ক্রিনে আসা ট্রিপের ভাড়ার টেক্সট বিশ্লেষণ করে স্বয়ংক্রিয়ভাবে ক্লিক করে।',
    guideSection3Title: '৩. সতর্কতা ও প্ল্যাটফর্মের নিয়মাবলী',
    guideSection3Body: 'Uber, Ola বা Rapido কোম্পানির নিয়মাবলীতে কোনো কোনো ক্ষেত্রে অননুমোদিত অটো-ক্লিকার বট ব্যবহার করলে অ্যাকাউন্ট ব্লক বা আইডি সাসপেন্ড হওয়ার ঝুঁকি থাকে। তাই অভিজ্ঞ ড্রাইভাররা শুধুমাত্র স্ক্রিন প্রফিট ক্যালকুলেটর ও অ্যালার্ট ব্যবহার করার পরামর্শ দেন।',
  },
  en: {
    appTitle: 'RidePilot',
    appSubtitle: 'Driver Auto-Accept & Smart Trip Filter',
    bilingualNotice: 'English / বাংলা',
    simulatorDisclaimer: 'This is a demo configuration. This button does not accept orders in real Rapido or Uber. Which one do you want?',
    disclaimerBadge: 'Simulation & Training Mode',
    learnMore: 'How real-world automation works',

    // Nav / Modes
    modeRules: 'Filter Settings',
    modeSimulator: 'Live Ride Radar',
    modeOverlay: 'Screen Overlay Preview',
    modeCalculator: 'Fuel & Profit Math',
    modeAnalytics: 'Shift & Trip History',
    modeAiAdvisor: 'AI Trip Advisor',

    // Core Settings requested by user
    autoAcceptTitle: 'Automatic Ride Acceptance',
    autoAcceptDesc: 'Automatically accept incoming ride requests when all filter rules are met',
    minFareLabel: 'Minimum Fare (₹)',
    minFareHelp: 'Any trip offer below this total gross fare will be declined',
    minFarePerKmLabel: 'Minimum Fare per km (₹)',
    minFarePerKmHelp: 'Calculated rate per km (Total Fare ÷ Trip Distance)',
    maxPickupDistanceLabel: 'Maximum Pickup Distance (km)',
    maxPickupDistanceHelp: 'Max distance you are willing to drive to pick up the rider',

    // Secondary filters
    minRatingLabel: 'Min Passenger Rating (★)',
    paymentModeLabel: 'Payment Method',
    allowCashOnly: 'Online + Cash Accepted',
    onlineOnly: 'Online / Wallet Only',
    platformsLabel: 'Active Platforms',
    vehicleTypesLabel: 'Vehicle Categories',
    dropZoneFilters: 'Drop Location Safety',
    excludedAreas: 'Restricted Areas (Blacklist)',
    preferredAreas: 'Preferred Hotspots',

    // Simulator controls
    startSimulation: 'Start Live Dispatcher Radar',
    stopSimulation: 'Pause Radar',
    generateSampleRide: 'Send Test Request',
    dispatcherStatusActive: 'Radar Active · Listening for ride pings',
    dispatcherStatusPaused: 'Radar Paused',
    secondsLeft: 'seconds left',
    incomingRideAlert: 'New Ride Request Incoming!',
    autoAcceptedBanner: 'Ride automatically accepted based on your rules!',
    rejectedBanner: 'Trip declined: Criteria not satisfied',
    manuallyAcceptedBanner: 'You manually accepted this trip',

    // Metrics & Card info
    pickupDist: 'Pickup Distance',
    tripDist: 'Trip Distance',
    estFare: 'Fare',
    ratePerKm: 'Per km',
    passenger: 'Passenger',
    rating: 'Rating',
    profitEstimate: 'Est. Net Profit',
    fuelEstimate: 'Fuel Cost',
    acceptRide: 'Accept Ride',
    rejectRide: 'Decline',
    reasonsFailed: 'Failed criteria',

    // Vehicles
    bike: 'Bike / Moto',
    auto: 'Auto / Rickshaw',
    cabMini: 'Mini / Hatchback',
    cabSedan: 'Sedan / Premier',
    cabEv: 'Electric Cab (EV)',

    // Fuel Calculator
    fuelPrice: 'Fuel Price (₹ per L/kg)',
    vehicleMileage: 'Mileage (km per L/kg)',
    platformFee: 'Platform Commission (%)',
    grossEarnings: 'Gross Revenue',
    fuelExpense: 'Fuel Expense',
    netTakeHome: 'Net Pocket Profit',
    effectivePerKm: 'Effective Net ₹/km',

    // Sound & System
    soundEffects: 'Sound Alerts',
    soundOn: 'On',
    soundOff: 'Off',
    resetDefaults: 'Reset to Defaults',
    exportReport: 'Export Shift Summary',
    clearHistory: 'Clear Trip Log',

    // Explainer Modal
    guideTitle: 'How does this actually work on Uber and Rapido?',
    guideSection1Title: '1. What is this app?',
    guideSection1Body: 'This is an educational simulation and strategy companion. It helps drivers model and test minimum fare, per-km rate, and max pickup thresholds to maximize daily profit before hitting the road.',
    guideSection2Title: '2. How do driver auto-accept apps work in the real world?',
    guideSection2Body: 'Real Android automation apps (such as Maxymo or Driver Utility Helper) use Android Accessibility Service permissions and floating system windows to read the on-screen fare text from Uber/Rapido and simulate the touch event on the accept button.',
    guideSection3Title: '3. Terms of Service & Account Safety',
    guideSection3Body: 'Ride-hailing companies monitor automated click patterns and third-party overlays. Always check local platform terms to prevent account restrictions. Most experienced captains use profitability filters as advisory decision aids.',
  },
};
