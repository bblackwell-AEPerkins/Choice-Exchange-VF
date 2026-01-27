// Subscription Care Providers Mock Data
// Hundreds of providers per specialty with highest density in Dallas

export interface SubscriptionProvider {
  id: string;
  name: string;
  specialty: string;
  specialtyId: string;
  city: string;
  state: string;
  zipCode: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  acceptingNew: boolean;
  monthlyPrice: number;
  nextAvailable: string;
  languages: string[];
  certifications: string[];
}

// Texas cities with heavy Dallas weighting
const texasCities = [
  { city: "Dallas", state: "TX", zips: ["75201", "75202", "75203", "75204", "75205", "75206", "75207", "75208", "75209", "75210", "75211", "75212", "75214", "75215", "75216", "75217", "75218", "75219", "75220", "75223", "75224", "75225", "75226", "75227", "75228", "75229", "75230", "75231", "75232", "75233", "75234", "75235", "75236", "75237", "75238", "75240", "75241", "75243", "75244", "75246", "75247", "75248", "75249", "75251", "75252", "75253", "75254"], weight: 50 },
  { city: "Fort Worth", state: "TX", zips: ["76101", "76102", "76103", "76104", "76105", "76106", "76107", "76108", "76109", "76110", "76111", "76112", "76114", "76115", "76116", "76117", "76118", "76119", "76120", "76123", "76126", "76129", "76130", "76131", "76132", "76133", "76134", "76135", "76137"], weight: 15 },
  { city: "Arlington", state: "TX", zips: ["76001", "76002", "76006", "76010", "76011", "76012", "76013", "76014", "76015", "76016", "76017", "76018"], weight: 10 },
  { city: "Plano", state: "TX", zips: ["75023", "75024", "75025", "75074", "75075", "75093", "75094"], weight: 8 },
  { city: "Irving", state: "TX", zips: ["75038", "75039", "75060", "75061", "75062", "75063"], weight: 5 },
  { city: "Frisco", state: "TX", zips: ["75033", "75034", "75035", "75068"], weight: 4 },
  { city: "McKinney", state: "TX", zips: ["75069", "75070", "75071", "75072"], weight: 3 },
  { city: "Garland", state: "TX", zips: ["75040", "75041", "75042", "75043", "75044", "75045"], weight: 3 },
  { city: "Richardson", state: "TX", zips: ["75080", "75081", "75082", "75083"], weight: 2 },
];

// Other major US cities for variety
const otherCities = [
  { city: "Houston", state: "TX", zips: ["77001", "77002", "77003", "77004", "77005", "77006", "77007", "77008", "77009", "77010"], weight: 8 },
  { city: "Austin", state: "TX", zips: ["78701", "78702", "78703", "78704", "78705", "78721", "78722", "78723"], weight: 6 },
  { city: "San Antonio", state: "TX", zips: ["78201", "78202", "78203", "78204", "78205", "78207", "78208", "78209"], weight: 5 },
  { city: "Phoenix", state: "AZ", zips: ["85001", "85002", "85003", "85004", "85006", "85007", "85008"], weight: 4 },
  { city: "Los Angeles", state: "CA", zips: ["90001", "90002", "90003", "90004", "90005", "90006", "90007"], weight: 4 },
  { city: "Chicago", state: "IL", zips: ["60601", "60602", "60603", "60604", "60605", "60606", "60607"], weight: 4 },
  { city: "Denver", state: "CO", zips: ["80202", "80203", "80204", "80205", "80206", "80207", "80209"], weight: 3 },
  { city: "Atlanta", state: "GA", zips: ["30301", "30302", "30303", "30305", "30306", "30307", "30308"], weight: 3 },
  { city: "Miami", state: "FL", zips: ["33101", "33102", "33125", "33126", "33127", "33128", "33129"], weight: 3 },
  { city: "Seattle", state: "WA", zips: ["98101", "98102", "98103", "98104", "98105", "98106", "98107"], weight: 2 },
];

const allCities = [...texasCities, ...otherCities];

// Specialty definitions with realistic naming patterns
const specialtyConfigs = {
  primary: {
    providerPrefixes: ["Dr.", "Dr.", "Dr.", "NP", "PA"],
    firstNames: ["Sarah", "Michael", "Jennifer", "David", "Emily", "Robert", "Lisa", "James", "Amanda", "Christopher", "Ashley", "Matthew", "Nicole", "Joshua", "Stephanie", "Andrew", "Megan", "Daniel", "Rachel", "Ryan", "Heather", "Justin", "Elizabeth", "Brandon", "Kimberly", "Jonathan", "Laura", "Kevin", "Jessica", "Brian", "Rebecca", "Tyler", "Samantha", "Eric", "Christina", "Adam", "Catherine", "Mark", "Lauren", "Steven"],
    lastNames: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"],
    clinicTypes: ["Family Medicine", "Internal Medicine", "Primary Care Associates", "Family Health Center", "Community Clinic", "Wellness Center", "Medical Group", "Healthcare Partners", "Family Practice", "Medical Associates"],
    priceRange: [75, 150],
    certifications: ["Board Certified in Family Medicine", "AAFP Member", "Primary Care Specialist", "Preventive Medicine Certified"],
  },
  mental: {
    providerPrefixes: ["Dr.", "Dr.", "LCSW", "LPC", "LMFT", "PsyD"],
    firstNames: ["Michelle", "William", "Patricia", "Richard", "Linda", "Charles", "Barbara", "Joseph", "Susan", "Thomas", "Margaret", "Kenneth", "Dorothy", "Steven", "Nancy", "Paul", "Karen", "Donald", "Betty", "George", "Helen", "Edward", "Sandra", "Brian", "Donna", "Ronald", "Carol", "Timothy", "Ruth", "Jason"],
    lastNames: ["Cohen", "Goldberg", "Patel", "Kim", "Chen", "Wong", "Park", "Shah", "Kumar", "Singh", "Murphy", "Kelly", "O'Brien", "Sullivan", "Campbell", "Stewart", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward"],
    clinicTypes: ["Mental Health Center", "Counseling Associates", "Therapy & Wellness", "Behavioral Health", "Mind & Body Wellness", "Psychology Group", "Psychiatric Services", "Counseling Center", "Wellness Therapy", "Mental Wellness Clinic"],
    priceRange: [99, 200],
    certifications: ["Licensed Clinical Social Worker", "Licensed Professional Counselor", "Board Certified Psychiatrist", "Cognitive Behavioral Therapy Certified"],
  },
  telehealth: {
    providerPrefixes: ["Dr.", "NP", "PA", "MD"],
    firstNames: ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery", "Dakota", "Reese", "Drew", "Skyler", "Cameron", "Jamie", "Kendall", "Blake", "Peyton", "Hayden", "Parker", "Sydney"],
    lastNames: ["Adams", "Nelson", "Hill", "Green", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Turner", "Phillips", "Evans", "Edwards", "Collins", "Stewart", "Morris", "Murphy", "Bailey"],
    clinicTypes: ["Virtual Care", "Telehealth Connect", "Online Health", "Digital Clinic", "Remote Care", "Virtual Med", "eHealth Services", "Connected Care", "Digital Health", "Virtual Wellness"],
    priceRange: [49, 99],
    certifications: ["Telehealth Certified", "Virtual Care Specialist", "Remote Medicine Licensed", "Digital Health Provider"],
  },
  pediatrics: {
    providerPrefixes: ["Dr.", "Dr.", "Dr.", "NP", "PA"],
    firstNames: ["Emma", "Olivia", "Ava", "Sophia", "Isabella", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn", "Liam", "Noah", "Oliver", "Elijah", "Lucas", "Mason", "Logan", "Alexander", "Ethan", "Jacob"],
    lastNames: ["Bennett", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Russell", "Butler", "Brooks", "Sanders", "Price", "Hughes", "Flores", "Washington", "Long", "Foster", "Sanders", "Gray", "James"],
    clinicTypes: ["Pediatric Associates", "Children's Health", "Kids Care Clinic", "Pediatric Wellness", "Family & Pediatrics", "Children's Medical", "Pediatric Partners", "Young Patients Care", "Healthy Kids Clinic", "Pediatric Health Center"],
    priceRange: [85, 165],
    certifications: ["Board Certified Pediatrician", "AAP Member", "Pediatric Care Specialist", "Child Development Certified"],
  },
  womens: {
    providerPrefixes: ["Dr.", "Dr.", "Dr.", "NP", "CNM"],
    firstNames: ["Katherine", "Victoria", "Alexandra", "Natalie", "Grace", "Chloe", "Lily", "Zoe", "Penelope", "Nora", "Eleanor", "Hazel", "Violet", "Stella", "Aurora", "Savannah", "Audrey", "Brooklyn", "Claire", "Skylar"],
    lastNames: ["Wood", "Watson", "Brooks", "Kelly", "Sanders", "Reed", "Cook", "Bailey", "Bennett", "Gray", "James", "Cruz", "Myers", "Ford", "Hamilton", "Graham", "Sullivan", "Wallace", "Woods", "Cole"],
    clinicTypes: ["Women's Health Center", "OB/GYN Associates", "Women's Wellness", "Feminine Care", "Women's Medical Group", "Gynecology Partners", "Women's Care Clinic", "Maternal Health", "Women's Health Partners", "Complete Women's Care"],
    priceRange: [79, 175],
    certifications: ["Board Certified OB/GYN", "Women's Health Specialist", "Certified Nurse Midwife", "Maternal-Fetal Medicine"],
  },
  orthopedics: {
    providerPrefixes: ["Dr.", "DPT", "PT", "Dr.", "OT"],
    firstNames: ["John", "Robert", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth", "Kevin"],
    lastNames: ["Strong", "Stone", "Steel", "Power", "Hart", "Knight", "Bishop", "Archer", "Hunter", "Mason", "Porter", "Carpenter", "Fisher", "Wright", "Cook", "Fox", "Burns", "Wolf", "Cross", "Lane"],
    clinicTypes: ["Physical Therapy & Rehab", "Sports Medicine", "Orthopedic Associates", "Movement & Mobility", "PT & Sports Medicine", "Rehab Specialists", "Body Works PT", "Athletic Therapy", "Motion Therapy", "Joint & Spine Center"],
    priceRange: [120, 250],
    certifications: ["Doctor of Physical Therapy", "Sports Medicine Certified", "Orthopedic Specialist", "Manual Therapy Certified"],
  },
};

const streetNames = ["Main St", "Oak Ave", "Medical Pkwy", "Healthcare Dr", "Wellness Blvd", "Health Center Way", "Clinic Rd", "Professional Dr", "Medical Center Blvd", "Care Center Ln", "Physician Plaza", "Doctors Row", "Health Park Dr", "Wellness Way", "Medical Arts Blvd"];
const languages = [["English"], ["English", "Spanish"], ["English", "Mandarin"], ["English", "Vietnamese"], ["English", "Korean"], ["English", "Hindi"], ["English", "Arabic"], ["English", "French"], ["English", "Portuguese"], ["English", "Tagalog"]];

function getWeightedRandomCity() {
  const totalWeight = allCities.reduce((sum, city) => sum + city.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const city of allCities) {
    random -= city.weight;
    if (random <= 0) {
      return city;
    }
  }
  return allCities[0]; // Fallback to Dallas
}

function generateProvider(specialty: string, index: number): SubscriptionProvider {
  const config = specialtyConfigs[specialty as keyof typeof specialtyConfigs];
  const cityData = getWeightedRandomCity();
  const zip = cityData.zips[Math.floor(Math.random() * cityData.zips.length)];
  
  const prefix = config.providerPrefixes[Math.floor(Math.random() * config.providerPrefixes.length)];
  const firstName = config.firstNames[Math.floor(Math.random() * config.firstNames.length)];
  const lastName = config.lastNames[Math.floor(Math.random() * config.lastNames.length)];
  const clinicType = config.clinicTypes[Math.floor(Math.random() * config.clinicTypes.length)];
  const street = streetNames[Math.floor(Math.random() * streetNames.length)];
  const streetNum = Math.floor(Math.random() * 9000) + 1000;
  const lang = languages[Math.floor(Math.random() * languages.length)];
  const cert = config.certifications.slice(0, Math.floor(Math.random() * 2) + 1);
  
  const price = config.priceRange[0] + Math.floor(Math.random() * (config.priceRange[1] - config.priceRange[0]));
  const rating = 3.5 + Math.random() * 1.5; // 3.5-5.0 rating
  const reviewCount = Math.floor(Math.random() * 400) + 10;
  
  // Generate next available date
  const daysAhead = Math.floor(Math.random() * 14) + 1;
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysAhead);
  const nextAvailable = nextDate.toISOString().split('T')[0];

  return {
    id: `${specialty}-provider-${index.toString().padStart(4, '0')}`,
    name: `${prefix} ${firstName} ${lastName}`,
    specialty: clinicType,
    specialtyId: specialty,
    city: cityData.city,
    state: cityData.state,
    zipCode: zip,
    address: `${streetNum} ${street}`,
    phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    rating: Math.round(rating * 10) / 10,
    reviewCount,
    acceptingNew: Math.random() > 0.15, // 85% accepting new patients
    monthlyPrice: price,
    nextAvailable,
    languages: lang,
    certifications: cert,
  };
}

// Generate 500+ providers per specialty (3000+ total)
const PROVIDERS_PER_SPECIALTY = 500;

export const subscriptionProviders: Record<string, SubscriptionProvider[]> = {
  primary: Array.from({ length: PROVIDERS_PER_SPECIALTY }, (_, i) => generateProvider('primary', i)),
  mental: Array.from({ length: PROVIDERS_PER_SPECIALTY }, (_, i) => generateProvider('mental', i)),
  telehealth: Array.from({ length: PROVIDERS_PER_SPECIALTY }, (_, i) => generateProvider('telehealth', i)),
  pediatrics: Array.from({ length: PROVIDERS_PER_SPECIALTY }, (_, i) => generateProvider('pediatrics', i)),
  womens: Array.from({ length: PROVIDERS_PER_SPECIALTY }, (_, i) => generateProvider('womens', i)),
  orthopedics: Array.from({ length: PROVIDERS_PER_SPECIALTY }, (_, i) => generateProvider('orthopedics', i)),
};

// Get all providers across all specialties
export const allProviders: SubscriptionProvider[] = Object.values(subscriptionProviders).flat();

// Helper function to get provider counts by city
export function getProviderCountsByCity(specialtyId?: string): Record<string, number> {
  const providers = specialtyId ? subscriptionProviders[specialtyId] || [] : allProviders;
  return providers.reduce((acc, p) => {
    acc[p.city] = (acc[p.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

// Helper function to filter providers
export function filterProviders(options: {
  specialtyId?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  acceptingNew?: boolean;
  maxPrice?: number;
  searchQuery?: string;
}): SubscriptionProvider[] {
  let providers = options.specialtyId 
    ? subscriptionProviders[options.specialtyId] || [] 
    : allProviders;

  if (options.city) {
    const cityLower = options.city.toLowerCase();
    providers = providers.filter(p => p.city.toLowerCase().includes(cityLower));
  }

  if (options.state) {
    providers = providers.filter(p => p.state.toLowerCase() === options.state!.toLowerCase());
  }

  if (options.zipCode) {
    providers = providers.filter(p => p.zipCode.startsWith(options.zipCode!));
  }

  if (options.acceptingNew !== undefined) {
    providers = providers.filter(p => p.acceptingNew === options.acceptingNew);
  }

  if (options.maxPrice) {
    providers = providers.filter(p => p.monthlyPrice <= options.maxPrice!);
  }

  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    providers = providers.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.specialty.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query)
    );
  }

  return providers;
}

// Get specialty statistics
export function getSpecialtyStats(specialtyId: string) {
  const providers = subscriptionProviders[specialtyId] || [];
  const dallasProviders = providers.filter(p => p.city === "Dallas");
  
  const prices = providers.map(p => p.monthlyPrice);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    totalCount: providers.length,
    dallasCount: dallasProviders.length,
    avgPrice: Math.round(avgPrice),
    minPrice,
    maxPrice,
    acceptingNewCount: providers.filter(p => p.acceptingNew).length,
  };
}
