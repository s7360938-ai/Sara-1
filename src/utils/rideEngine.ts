import { FilterSettings, PlatformType, RideOffer, VehicleProfile, VehicleType, PaymentMode } from '../types';
import { CITY_PRESETS, SAMPLE_PASSENGERS } from '../data/sampleLocations';

export function calculateTripFinancials(
  fare: number,
  pickupDistanceKm: number,
  tripDistanceKm: number,
  profile: VehicleProfile
) {
  const totalKm = pickupDistanceKm + tripDistanceKm;
  const commission = fare * (profile.platformCommissionPercent / 100);
  const fuelUsed = profile.mileagePerUnit > 0 ? totalKm / profile.mileagePerUnit : 0;
  const fuelCost = fuelUsed * profile.fuelCostPerUnit;
  const netProfit = fare - commission - fuelCost;

  return {
    fuelCost: Math.round(fuelCost * 10) / 10,
    netProfit: Math.round(netProfit * 10) / 10,
    totalKm: Math.round(totalKm * 10) / 10,
  };
}

export function evaluateRideOffer(
  ride: Omit<RideOffer, 'status' | 'rejectionReasons' | 'netProfit' | 'fuelCost'>,
  settings: FilterSettings,
  profile: VehicleProfile,
  lang: 'bn' | 'en'
): {
  isAccepted: boolean;
  reasons: string[];
  netProfit: number;
  fuelCost: number;
} {
  const reasons: string[] = [];
  const { fuelCost, netProfit } = calculateTripFinancials(
    ride.fare,
    ride.pickupDistanceKm,
    ride.tripDistanceKm,
    profile
  );

  // Check 1: Minimum total fare
  if (ride.fare < settings.minFare) {
    reasons.push(
      lang === 'bn'
        ? `ভাড়া ₹${ride.fare} (আপনার ন্যূনতম সীমা ₹${settings.minFare}-এর কম)`
        : `Fare ₹${ride.fare} is below minimum threshold ₹${settings.minFare}`
    );
  }

  // Check 2: Minimum fare per km
  if (ride.farePerKm < settings.minFarePerKm) {
    reasons.push(
      lang === 'bn'
        ? `ভাড়া প্রতি কিমি ₹${ride.farePerKm} (আপনার ন্যূনতম ₹${settings.minFarePerKm}/কিমি-এর কম)`
        : `Rate ₹${ride.farePerKm}/km is below minimum ₹${settings.minFarePerKm}/km`
    );
  }

  // Check 3: Maximum pickup distance
  if (ride.pickupDistanceKm > settings.maxPickupDistance) {
    reasons.push(
      lang === 'bn'
        ? `পিকআপ দূরত্ব ${ride.pickupDistanceKm} কিমি (আপনার সীমা ${settings.maxPickupDistance} কিমি-এর বেশি)`
        : `Pickup distance ${ride.pickupDistanceKm} km exceeds limit ${settings.maxPickupDistance} km`
    );
  }

  // Check 4: Passenger rating
  if (ride.passengerRating < settings.minPassengerRating) {
    reasons.push(
      lang === 'bn'
        ? `যাত্রীর রেটিং ${ride.passengerRating}★ (আপনার ন্যূনতম ${settings.minPassengerRating}★-এর নিচে)`
        : `Passenger rating ${ride.passengerRating}★ below minimum ${settings.minPassengerRating}★`
    );
  }

  // Check 5: Cash payment check
  if (!settings.allowCash && ride.paymentMode === 'cash') {
    reasons.push(
      lang === 'bn'
        ? `পেমেন্ট ক্যাশ (আপনার সেটিংসে শুধুমাত্র অনলাইন এলাউড)`
        : `Payment is Cash (only online/wallet allowed)`
    );
  }

  // Check 6: Platform allowed
  if (!settings.allowedPlatforms.includes(ride.platform)) {
    reasons.push(
      lang === 'bn'
        ? `প্ল্যাটফর্ম ${ride.platform.toUpperCase()} আপনার সক্রিয় তালিকায় নেই`
        : `Platform ${ride.platform.toUpperCase()} is not enabled`
    );
  }

  // Check 7: Vehicle category allowed
  if (!settings.allowedVehicleTypes.includes(ride.vehicleType)) {
    reasons.push(
      lang === 'bn'
        ? `গাড়ির ধরন ফিল্টারে সক্রিয় নয়`
        : `Vehicle type not enabled in filters`
    );
  }

  // Check 8: Excluded drop areas
  if (settings.excludedDropAreas.some((area) => ride.dropLocation.toLowerCase().includes(area.toLowerCase()))) {
    reasons.push(
      lang === 'bn'
        ? `ড্রপ এলাকা আপনার ব্লক তালিকায় অন্তর্ভুক্ত (${ride.dropLocation})`
        : `Drop area is in restricted blacklist (${ride.dropLocation})`
    );
  }

  return {
    isAccepted: reasons.length === 0,
    reasons,
    netProfit,
    fuelCost,
  };
}

export function generateMockRide(
  settings: FilterSettings,
  profile: VehicleProfile,
  lang: 'bn' | 'en',
  cityId: string = 'kolkata'
): RideOffer {
  const city = CITY_PRESETS.find((c) => c.id === cityId) || CITY_PRESETS[0];
  const passenger = SAMPLE_PASSENGERS[Math.floor(Math.random() * SAMPLE_PASSENGERS.length)];

  const platforms: PlatformType[] = ['uber', 'rapido', 'ola', 'indrive'];
  const platform = platforms[Math.floor(Math.random() * platforms.length)];

  const vehicleType = profile.type;

  const pickup = city.pickups[Math.floor(Math.random() * city.pickups.length)];
  let drop = city.drops[Math.floor(Math.random() * city.drops.length)];
  while (drop === pickup) {
    drop = city.drops[Math.floor(Math.random() * city.drops.length)];
  }

  // Realistic pickup distance: 0.4 to 6.2 km
  const pickupDistanceKm = Math.round((0.5 + Math.random() * 5.5) * 10) / 10;
  // Realistic trip distance: 2.5 to 24 km
  const tripDistanceKm = Math.round((2.0 + Math.random() * 20) * 10) / 10;
  const estimatedDurationMins = Math.round(tripDistanceKm * 3.2 + 4);

  // Base rate depends on vehicle
  let baseRatePerKm = 24; // Cab standard
  if (vehicleType === 'bike') baseRatePerKm = 12;
  else if (vehicleType === 'auto') baseRatePerKm = 18;
  else if (vehicleType === 'cab_sedan') baseRatePerKm = 30;

  // Add random variability and occasional surge
  const surgeChance = Math.random();
  const surgeMultiplier = surgeChance > 0.7 ? Math.round((1.2 + Math.random() * 0.8) * 10) / 10 : 1.0;

  // Sometimes lower than min to test rejection logic, sometimes higher
  const rateVariance = 0.8 + Math.random() * 0.5; // 0.8 to 1.3
  const effectiveRate = Math.round(baseRatePerKm * rateVariance * surgeMultiplier * 10) / 10;
  const baseFare = Math.round(effectiveRate * tripDistanceKm + (vehicleType === 'bike' ? 25 : 45));
  const fare = Math.max(35, baseFare);
  const farePerKm = Math.round((fare / tripDistanceKm) * 10) / 10;

  const paymentModes: PaymentMode[] = ['online', 'online', 'cash', 'wallet'];
  const paymentMode = paymentModes[Math.floor(Math.random() * paymentModes.length)];

  const candidate = {
    id: 'TRIP-' + Math.floor(100000 + Math.random() * 900000),
    timestamp: Date.now(),
    platform,
    vehicleType,
    passengerName: passenger.name,
    passengerRating: passenger.rating,
    pickupLocation: pickup,
    dropLocation: drop,
    pickupDistanceKm,
    tripDistanceKm,
    estimatedDurationMins,
    fare,
    farePerKm,
    paymentMode,
    surgeMultiplier,
    expiresInSeconds: 15,
  };

  const evaluation = evaluateRideOffer(candidate, settings, profile, lang);

  const status: RideOffer['status'] = settings.autoAcceptEnabled
    ? evaluation.isAccepted
      ? 'auto_accepted'
      : 'rejected'
    : 'pending';

  return {
    ...candidate,
    status,
    rejectionReasons: evaluation.reasons,
    netProfit: evaluation.netProfit,
    fuelCost: evaluation.fuelCost,
  };
}
