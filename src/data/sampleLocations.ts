export interface CityPreset {
  id: string;
  name: string;
  currency: string;
  pickups: string[];
  drops: string[];
}

export const CITY_PRESETS: CityPreset[] = [
  {
    id: 'kolkata',
    name: 'Kolkata (কলকাতা)',
    currency: '₹',
    pickups: [
      'Salt Lake Sector V',
      'Park Street Metro',
      'Howrah Railway Station',
      'Sealdah Station',
      'Gariahat Crossing',
      'New Town Action Area 1',
      'Ruby Hospital Crossing',
      'Esplanade Bus Terminus',
      'Dum Dum Airport Gate 1',
      'Jadavpur 8B Bus Stand',
      'South City Mall',
      'Behala Chowrasta'
    ],
    drops: [
      'Netaji Subhash Chandra Bose Int. Airport (CCU)',
      'Howrah Railway Station Platform 1',
      'New Town Eco Space IT Park',
      'Salt Lake Karunamoyee',
      'Alipore Zoo & National Library',
      'Science City EM Bypass',
      'Sector 1 Residential Block',
      'Rajarhat Chinar Park',
      'Garia Metro Station',
      'Barasat Kadamgachhi'
    ]
  },
  {
    id: 'dhaka',
    name: 'Dhaka (ঢাকা)',
    currency: '৳',
    pickups: [
      'Gulshan 2 Circle',
      'Dhanmondi 27',
      'Uttara Sector 7',
      'Banani 11',
      'Motijheel C/A',
      'Mirpur 10 Circle',
      'Shahbagh Square',
      'Mohakhali Wireless Gate'
    ],
    drops: [
      'Hazrat Shahjalal Int. Airport (DAC)',
      'Kamalapur Railway Station',
      'Bashundhara R/A Block C',
      'Purbachal New Town',
      'Gulshan 1 Police Plaza',
      'Uttara Diabari Metro Depot'
    ]
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru (বেঙ্গালুরু)',
    currency: '₹',
    pickups: [
      'Koramangala 5th Block',
      'Indiranagar 100ft Road',
      'Whitefield ITPL Main Gate',
      'HSR Layout Sector 2',
      'MG Road Metro',
      'Electronic City Phase 1'
    ],
    drops: [
      'Kempegowda Int. Airport (BLR)',
      'Krantivira Sangolli Rayanna Station',
      'Bellandur EcoWorld',
      'Bannerghatta Road Vega City',
      'Sarjapur Road Wipro Gate'
    ]
  }
];

export const SAMPLE_PASSENGERS = [
  { name: 'Arjun Sen', rating: 4.88 },
  { name: 'Priyanka Das', rating: 4.92 },
  { name: 'Rahul Banerjee', rating: 4.65 },
  { name: 'Tanmoy Mukherjee', rating: 4.95 },
  { name: 'Sneha Chakraborty', rating: 4.78 },
  { name: 'Debashis Roy', rating: 4.52 },
  { name: 'Ananya Ghosh', rating: 4.90 },
  { name: 'Amitabh Dutta', rating: 4.70 },
  { name: 'Sourav Ganguly', rating: 4.99 },
  { name: 'Mousumi Sarkar', rating: 4.60 },
  { name: 'Vikram Joshi', rating: 4.40 },
  { name: 'Fatima Rahman', rating: 4.85 }
];
