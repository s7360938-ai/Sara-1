export type PlatformType = 'uber' | 'rapido' | 'ola' | 'indrive';

export type VehicleType = 'bike' | 'auto' | 'cab_mini' | 'cab_sedan' | 'cab_ev';

export type PaymentMode = 'cash' | 'online' | 'wallet';

export interface FilterSettings {
  autoAcceptEnabled: boolean;
  minFare: number; // ₹
  minFarePerKm: number; // ₹/km
  maxPickupDistance: number; // km
  minPassengerRating: number; // 3.0 to 5.0
  allowedPlatforms: PlatformType[];
  allowedVehicleTypes: VehicleType[];
  allowCash: boolean;
  excludedDropAreas: string[];
  preferredDropAreas: string[];
}

export interface VehicleProfile {
  type: VehicleType;
  name: string;
  fuelType: 'petrol' | 'cng' | 'diesel' | 'electric';
  fuelCostPerUnit: number; // ₹ per liter / kg / kWh
  mileagePerUnit: number; // km per liter / kg / kWh
  platformCommissionPercent: number; // e.g. 20%
}

export interface RideOffer {
  id: string;
  timestamp: number;
  platform: PlatformType;
  vehicleType: VehicleType;
  passengerName: string;
  passengerRating: number;
  pickupLocation: string;
  dropLocation: string;
  pickupDistanceKm: number;
  tripDistanceKm: number;
  estimatedDurationMins: number;
  fare: number; // ₹
  farePerKm: number; // ₹/km calculated
  paymentMode: PaymentMode;
  surgeMultiplier: number; // 1.0x, 1.3x, etc.
  status: 'pending' | 'auto_accepted' | 'manually_accepted' | 'rejected' | 'expired';
  rejectionReasons: string[];
  netProfit: number;
  fuelCost: number;
  expiresInSeconds: number;
}

export interface ShiftStats {
  totalEvaluated: number;
  acceptedCount: number;
  rejectedCount: number;
  totalGrossEarnings: number;
  totalNetProfit: number;
  totalFuelCost: number;
  totalKilometers: number;
}

export interface RiderRating {
  id: string;
  rideId: string;
  driverId: string;
  driverName: string;
  riderName: string;
  rating: number; // 1 to 5
  feedbackTags: string[];
  writtenComment?: string;
  tipAmount: number; // ₹
  timestamp: number;
  platform: PlatformType;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  vehicleModel: string;
  licensePlate: string;
  averageRating: number;
  totalRatingsCount: number;
  starBreakdown: { [star: number]: number };
  badgeTitle: string;
  recentReviews: RiderRating[];
}

export interface ApkPackage {
  id: string;
  title: string;
  packageName: string;
  version: string;
  fileSize: string;
  minAndroid: string;
  releaseDate: string;
  downloadUrl: string;
  description: string;
  iconType: 'driver' | 'rider' | 'suite' | 'tool';
  tags: string[];
}
