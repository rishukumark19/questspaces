import elaraImg from '../assets/elara_celestia.png';
import visistaImg from '../assets/visista_villas.png';
import embassyImg from '../assets/embassy_astra.png';
import lodhaImg from '../assets/lodha_mirabelle.png';
import quietImg from '../assets/quiet_earth.png';
import aeropolisImg from '../assets/aeropolis_plots.png';

export const PROPERTIES = [
  {
    id: "lt-realty-elara-celestia",
    slug: "lt-realty-elara-celestia",
    title: "L&T Realty Elara Celestia",
    developer: "L&T Realty",
    location: "Hebbal, Bengaluru North",
    fullAddress: "Hebbal Flyover Junction, Bellary Road, Bengaluru North - 560032",
    micromarket: "Hebbal",
    micromarketLabel: "Hebbal Airport Corridor",
    propertyType: "Luxury Apartment",
    status: "New Launch",
    startingPrice: "\u20B93.32 Cr*",
    priceValue: 33200000,
    pricePerSqFt: "\u20B917,950 / sq.ft",
    configurations: "3 & 4 BHK Luxury Residences",
    bhkOptions: ["3 BHK", "4 BHK"],
    landParcel: "10 Acres",
    totalUnits: 630,
    possession: "2029",
    towerHeight: "G + 28 Floors",
    reraId: "PRM/KA/RERA/1251/309/PR/241018/007142",
    featured: true,
    badges: ["Featured Luxury", "Under Construction", "Hebbal Hub"],
    heroImage: elaraImg,
    images: [
      elaraImg,
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "L&T Realty Elara Celestia represents the pinnacle of modern architectural luxury in Hebbal, Bengaluru North. Spanning across 10 lush green acres, this prestigious high-rise sanctuary offers thoughtfully crafted 3 & 4 BHK residences designed for abundant natural light, complete spatial privacy, and world-class resort amenities.",
    longDescription: "Strategically positioned minutes from the Hebbal Flyover and the Kempegowda International Airport elevated corridor, Elara Celestia provides seamless connectivity to premier tech parks (Manyata, Kirloskar), top international schools, and leading multi-specialty hospitals like Aster CMI. Experience a lifestyle crafted by L&T Realty's legendary engineering standards.",
    highlights: [
      "Multi-level grand clubhouse with indoor heated pool",
      "Adventure climbing wall & butterfly sanctuary park",
      "Olympic-length temperature-controlled lap pool",
      "Direct frontage to Hebbal Airport Corridor",
      "EV charging spots for all residential parking slots"
    ],
    pricingMatrix: [
      { config: "3 BHK Executive", carpetArea: "1,250 Sq. Ft.", superArea: "1,850 Sq. Ft.", price: "\u20B93.32 Cr*", availability: "Limited Units" },
      { config: "3.5 BHK Premium", carpetArea: "1,480 Sq. Ft.", superArea: "2,200 Sq. Ft.", price: "\u20B93.85 Cr*", availability: "Available" },
      { config: "4 BHK Signature", carpetArea: "1,850 Sq. Ft.", superArea: "2,750 Sq. Ft.", price: "\u20B94.75 Cr*", availability: "Fast Selling" }
    ],
    amenities: [
      { category: "Sports & Fitness", list: ["Olympic Swimming Pool", "Outdoor Gym", "Sand Volleyball Court", "Cricket Pitch", "Tennis Court"] },
      { category: "Leisure & Social", list: ["Outdoor Cinema", "Grand Amphitheatre", "Luxe Cafe", "Party Lawn", "Sky Lounge"] },
      { category: "Wellness & Nature", list: ["Butterfly Park", "Yoga Deck", "Senior Citizen Lawn", "Therapeutic Gardens"] }
    ],
    proximity: [
      { title: "Manyata Tech Park", distance: "10 Mins" },
      { title: "Kirloskar Business Park", distance: "5 Mins" },
      { title: "Kempegowda Int. Airport", distance: "25 Mins" },
      { title: "Aster CMI Hospital", distance: "4 Mins" },
      { title: "Phoenix Mall of Asia", distance: "8 Mins" }
    ]
  },
  {
    id: "visista-by-vista-spaces",
    slug: "visista-by-vista-spaces",
    title: "Visista By Vista Spaces",
    developer: "Vista Spaces",
    location: "Yelahanka Old Town, Bengaluru North",
    fullAddress: "Near Yelahanka Lake & NH 44, Yelahanka Old Town, Bengaluru - 560064",
    micromarket: "Yelahanka",
    micromarketLabel: "Yelahanka Serene Corridor",
    propertyType: "Modern Villa",
    status: "Ready to Move In",
    startingPrice: "\u20B93.00 Cr",
    priceValue: 30000000,
    pricePerSqFt: "\u20B914,500 / sq.ft",
    configurations: "3 & 3.5 BHK Executive Suites",
    bhkOptions: ["3 BHK", "3.5 BHK"],
    landParcel: "4.15 Acres",
    totalUnits: 236,
    possession: "Ready to Move",
    towerHeight: "Bespoke Low-Density Blocks",
    reraId: "PRM/KA/RERA/1251/309/PR/220315/004812",
    featured: true,
    badges: ["Ready to Move In", "Yelahanka Premier", "Low Density"],
    heroImage: visistaImg,
    images: [
      visistaImg,
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Visista By Vista Spaces offers boutique luxury living surrounded by Yelahanka's tranquil green belts. Designed for families seeking low-density exclusivity without sacrificing city connectivity.",
    longDescription: "Enjoy spacious layout plans with expansive private balconies, premium Italian marble flooring, and access to private sports arenas. Located near top international institutions like Ryan International and Canadian International School.",
    highlights: [
      "Low-density boutique project with only 236 residences",
      "Dedicated senior citizen outdoor park & reading deck",
      "Indoor wooden-floored badminton courts & squash arena",
      "Sand volleyball arena & sunset view yoga deck"
    ],
    pricingMatrix: [
      { config: "3 BHK Executive", carpetArea: "1,350 Sq. Ft.", superArea: "1,980 Sq. Ft.", price: "\u20B93.00 Cr", availability: "Ready to Move" },
      { config: "3.5 BHK Suite", carpetArea: "1,550 Sq. Ft.", superArea: "2,350 Sq. Ft.", price: "\u20B93.45 Cr", availability: "Limited Units" }
    ],
    amenities: [
      { category: "Sports & Fitness", list: ["Badminton Courts", "Squash Arena", "Jogging Track", "Gymnasium"] },
      { category: "Wellness", list: ["Yoga Lawn", "Senior Citizen Park", "Meditation Alcove"] }
    ],
    proximity: [
      { title: "Yelahanka Railway Station", distance: "5 Mins" },
      { title: "Canadian International School", distance: "8 Mins" },
      { title: "Manipal Hospital Yelahanka", distance: "7 Mins" },
      { title: "Kempegowda Int. Airport", distance: "20 Mins" }
    ]
  },
  {
    id: "embassy-astra",
    slug: "embassy-astra",
    title: "Embassy Astra",
    developer: "Embassy Group",
    location: "Hebbal, Bengaluru North",
    fullAddress: "Bellary Road, Opposite Hebbal Lake, Bengaluru North - 560032",
    micromarket: "Hebbal",
    micromarketLabel: "Hebbal Luxury Hub",
    propertyType: "Luxury Apartment",
    status: "Pre-Launch",
    startingPrice: "\u20B93.95 Cr*",
    priceValue: 39500000,
    pricePerSqFt: "\u20B919,200 / sq.ft",
    configurations: "3 & 4 BHK Signature Residences",
    bhkOptions: ["3 BHK", "4 BHK", "5+ BHK"],
    landParcel: "10 Acres",
    totalUnits: 600,
    possession: "2029",
    towerHeight: "G + 34 Floors Iconic Towers",
    reraId: "PRM/KA/RERA/1251/309/PR/241105/007201",
    featured: true,
    badges: ["High Capital Growth", "Iconic Address", "Under Construction"],
    heroImage: embassyImg,
    images: [
      embassyImg,
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Embassy Astra brings the signature luxury and prestige of Embassy Group to Hebbal. High-rise landmark towers overlooking Hebbal Lake with world-class concierge and wellness facilities.",
    longDescription: "Crafted for executive living and NRI investors seeking capital appreciation. Features double-height sky lounges, private elevator foyers, and bespoke interior concierge support.",
    highlights: [
      "Iconic architectural towers designed by international architects",
      "Outdoor movie amphitheater & rooftop infinity pool",
      "Lavish wellness spa, hydrotherapy zone & sauna",
      "Direct access to Bengaluru Airport expressway corridor"
    ],
    pricingMatrix: [
      { config: "3 BHK Signature", carpetArea: "1,400 Sq. Ft.", superArea: "2,050 Sq. Ft.", price: "\u20B93.95 Cr*", availability: "Available" },
      { config: "4 BHK Royal Suite", carpetArea: "1,950 Sq. Ft.", superArea: "2,900 Sq. Ft.", price: "\u20B95.20 Cr*", availability: "Exclusive" }
    ],
    amenities: [
      { category: "Lifestyle", list: ["Rooftop Infinity Pool", "Sky Lounge", "Concierge Desk", "Private Cinema"] },
      { category: "Fitness", list: ["Crossfit Studio", "Tennis Court", "Spa & Sauna"] }
    ],
    proximity: [
      { title: "Hebbal Flyover", distance: "3 Mins" },
      { title: "RMZ Galleria Mall", distance: "12 Mins" },
      { title: "Vidya Shilp Academy", distance: "10 Mins" }
    ]
  },
  {
    id: "lodha-mirabelle-phase-3",
    slug: "lodha-mirabelle-phase-3",
    title: "Lodha Mirabelle Phase 3",
    developer: "Lodha Group",
    location: "Manyata Tech Park, Kempapura, Bengaluru",
    fullAddress: "Inside Manyata Tech Park Precinct, Kempapura, Bengaluru - 560045",
    micromarket: "Manyata Tech Park",
    micromarketLabel: "Tech Hub Walk-to-Work Zone",
    propertyType: "Luxury Apartment",
    status: "Under Construction",
    startingPrice: "\u20B92.95 Cr*",
    priceValue: 29500000,
    pricePerSqFt: "\u20B916,500 / sq.ft",
    configurations: "3 & 3.5 BHK Modern Homes",
    bhkOptions: ["3 BHK", "3.5 BHK"],
    landParcel: "10.2 Acres",
    totalUnits: 400,
    possession: "2029",
    towerHeight: "G + 26 Floors",
    reraId: "PRM/KA/RERA/1251/309/PR/231210/006500",
    featured: true,
    badges: ["Tech Corridor Special", "High Rental Return", "Lodha Quality"],
    heroImage: lodhaImg,
    images: [
      lodhaImg,
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Located right inside the thriving Manyata Tech Park precinct, Lodha Mirabelle Phase 3 combines walk-to-work convenience with Lodha's signature luxury lifestyle design.",
    longDescription: "Ideal for senior tech executives and investors aiming for 15%+ rental yields. Surround yourself with 10+ acres of open green landscapes, swimming pools, cafe lounges, and sports clubs.",
    highlights: [
      "Zero commute location directly inside Manyata Tech Park enclave",
      "Heated indoor private pool & squash courts",
      "Full 10.2-acre master planned community"
    ],
    pricingMatrix: [
      { config: "3 BHK Urban", carpetArea: "1,200 Sq. Ft.", superArea: "1,750 Sq. Ft.", price: "\u20B92.95 Cr*", availability: "Fast Selling" },
      { config: "3.5 BHK Executive", carpetArea: "1,450 Sq. Ft.", superArea: "2,150 Sq. Ft.", price: "\u20B93.50 Cr*", availability: "Available" }
    ],
    amenities: [
      { category: "Clubhouse", list: ["Poolside Cafe", "Co-working Pods", "Mini Theater", "Billiards Lounge"] }
    ],
    proximity: [
      { title: "Manyata Tech Park Gate 1", distance: "2 Mins" },
      { title: "Elements Mall", distance: "5 Mins" },
      { title: "Hebbal Junction", distance: "8 Mins" }
    ]
  },
  {
    id: "total-environment-quiet-earth",
    slug: "total-environment-quiet-earth",
    title: "In That Quiet Earth",
    developer: "Total Environment",
    location: "Hennur-Thanisandra Road, Bengaluru",
    fullAddress: "Off Hennur Main Road, Near Thanisandra Junction, Bengaluru - 560077",
    micromarket: "Thanisandra",
    micromarketLabel: "Hennur-Thanisandra Belt",
    propertyType: "Row House",
    status: "Under Construction",
    startingPrice: "\u20B94.50 Cr*",
    priceValue: 45000000,
    pricePerSqFt: "\u20B918,500 / sq.ft",
    configurations: "3, 4 & 5 BHK Earth-Sheltered Homes",
    bhkOptions: ["3 BHK", "4 BHK", "5+ BHK"],
    landParcel: "15 Acres",
    totalUnits: 280,
    possession: "2027",
    towerHeight: "G + 3 Floors Biophilic Villas",
    reraId: "PRM/KA/RERA/1251/446/PR/180507/001648",
    featured: false,
    badges: ["Biophilic Luxury", "Terrace Gardens", "Row House"],
    heroImage: quietImg,
    images: [
      quietImg,
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Crafted by Total Environment, these biophilic row houses feature private terrace gardens, natural timber finishes, and custom furniture fittings.",
    longDescription: "Every house is designed to blend seamlessly into lush green gardens, with expansive glass windows and automated climate controls.",
    highlights: ["Private landscaped rooftop terrace garden", "Customized interior wood work included", "Heat pump heated swimming pools"],
    pricingMatrix: [
      { config: "3 BHK Terrace House", carpetArea: "1,900 Sq. Ft.", superArea: "2,600 Sq. Ft.", price: "\u20B94.50 Cr*", availability: "Limited" },
      { config: "4 BHK Duplex Villa", carpetArea: "2,500 Sq. Ft.", superArea: "3,500 Sq. Ft.", price: "\u20B96.20 Cr*", availability: "Available" }
    ],
    amenities: [{ category: "Nature", list: ["Bio Pond", "Terrace Gardens", "Tree-lined Walkways"] }],
    proximity: [
      { title: "Hennur Junction", distance: "4 Mins" },
      { title: "Manyata Tech Park", distance: "12 Mins" },
      { title: "Cratis Hospital", distance: "8 Mins" },
      { title: "Outer Ring Road", distance: "10 Mins" },
      { title: "Kempegowda Airport", distance: "30 Mins" }
    ]
  },
  {
    id: "devanahalli-aeropolis-plots",
    slug: "devanahalli-aeropolis-plots",
    title: "Aeropolis Sovereign Plotted Estates",
    developer: "Aditya Birla Real Estate",
    location: "Devanahalli Airport Belt, Bengaluru",
    fullAddress: "Near Kempegowda International Airport Toll Plaza, Devanahalli, Bengaluru - 562110",
    micromarket: "Devanahalli",
    micromarketLabel: "Aerotropolis Growth Corridor",
    propertyType: "Investment Plot",
    status: "New Launch",
    startingPrice: "\u20B91.65 Cr*",
    priceValue: 16500000,
    pricePerSqFt: "\u20B95,500 / sq.ft",
    configurations: "1,500 to 4,000 Sq. Ft. Villa Plots",
    bhkOptions: ["Plots"],
    landParcel: "25 Acres",
    totalUnits: 180,
    possession: "2026",
    towerHeight: "Gated Plotted Enclave",
    reraId: "PRM/KA/RERA/1250/303/PR/240212/006611",
    featured: false,
    badges: ["High Capital Appreciation", "Airport Belt", "RERA Approved Plots"],
    heroImage: aeropolisImg,
    images: [
      aeropolisImg,
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Premium RERA-approved plotted development in Devanahalli, the high-growth Aerotropolis Corridor near KIADB IT Hardware Park and Boeing R&D campus.",
    longDescription: "Invest in land parcels with underground cabling, wide asphalted roads, grand entrance plaza, and a fully functional 15,000 sq.ft. clubhouse.",
    highlights: ["10 Mins from Kempegowda Airport", "Underground utility connections", "High potential land appreciation corridor"],
    pricingMatrix: [
      { config: "30x40 Plot (1,200 sq.ft)", carpetArea: "1,200 Sq. Ft.", superArea: "1,200 Sq. Ft.", price: "\u20B91.65 Cr*", availability: "Available" },
      { config: "40x60 Villa Plot (2,400 sq.ft)", carpetArea: "2,400 Sq. Ft.", superArea: "2,400 Sq. Ft.", price: "\u20B93.10 Cr*", availability: "Limited" }
    ],
    amenities: [{ category: "Infrastructure", list: ["Asphalted Roads", "Clubhouse", "24/7 Security", "Solar Lighting"] }],
    proximity: [
      { title: "KIADB Aerospace Park", distance: "5 Mins" },
      { title: "Kempegowda Int. Airport", distance: "10 Mins" },
      { title: "Manipal Hospital North", distance: "15 Mins" },
      { title: "Devanahalli Business Park", distance: "8 Mins" },
      { title: "STRR Expressway", distance: "6 Mins" }
    ]
  },
  {
    id: "prestige-golfshire-mansions",
    slug: "prestige-golfshire-mansions",
    title: "Prestige Golfshire Signature Villas",
    developer: "Prestige Group",
    location: "Nandi Hills Road, Devanahalli, Bengaluru",
    fullAddress: "Nandi Hills Road, Off NH 44, Devanahalli, Bengaluru - 562110",
    micromarket: "Devanahalli",
    micromarketLabel: "Nandi Hills Luxury Enclave",
    propertyType: "Modern Villa",
    status: "Ready to Move In",
    startingPrice: "\u20B99.50 Cr*",
    priceValue: 95000000,
    pricePerSqFt: "\u20B922,000 / sq.ft",
    configurations: "4 & 5 BHK Golf Mansions",
    bhkOptions: ["4 BHK", "5+ BHK"],
    landParcel: "275 Acres",
    totalUnits: 206,
    possession: "Ready to Move",
    towerHeight: "Ultra-Luxury Independent Mansions",
    reraId: "PRM/KA/RERA/1250/303/PR/170915/000214",
    featured: true,
    badges: ["18-Hole Golf Course", "JW Marriott Access", "Ready to Move In"],
    heroImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Nestled at the picturesque foothills of Nandi Hills, Prestige Golfshire is an ultra-exclusive 275-acre golf resort and residential community featuring an 18-hole championship golf course and JW Marriott Hotel.",
    longDescription: "Bespoke independent mansions offering private swimming pools, panoramic golf course fairways, and dedicated butler concierge services.",
    highlights: [
      "Bob Hunt designed 18-hole championship golf course",
      "Direct hospitality privileges with JW Marriott Nandi Hills",
      "Helipad facility & private clubhouse with cigar lounge",
      "Scenic lakefront setting at the base of Nandi Hills"
    ],
    pricingMatrix: [
      { config: "4 BHK Augusta Villa", carpetArea: "4,800 Sq. Ft.", superArea: "5,895 Sq. Ft.", price: "\u20B99.50 Cr*", availability: "Limited" },
      { config: "5 BHK Signature Mansion", carpetArea: "6,500 Sq. Ft.", superArea: "8,500 Sq. Ft.", price: "\u20B914.20 Cr*", availability: "Exclusive" }
    ],
    amenities: [
      { category: "Golf & Sports", list: ["18-Hole Golf Course", "Golf Academy", "Squash & Tennis Courts", "Olympic Swimming Pool"] },
      { category: "Luxury & Wellness", list: ["Quan Spa & Wellness Hub", "Private Dining Lounge", "Cigar Room", "Helipad"] }
    ],
    proximity: [
      { title: "Kempegowda Int. Airport", distance: "15 Mins" },
      { title: "Nandi Hills Base", distance: "5 Mins" },
      { title: "Devanahalli SEZ", distance: "12 Mins" },
      { title: "Hebbal Flyover", distance: "35 Mins" }
    ]
  },
  {
    id: "total-environment-radical-rhapsody",
    slug: "total-environment-radical-rhapsody",
    title: "Pursuit of a Radical Rhapsody",
    developer: "Total Environment",
    location: "ITPL Main Road, Whitefield, Bengaluru",
    fullAddress: "ITPL Main Road, Hoodi, Whitefield, Bengaluru - 560048",
    micromarket: "Whitefield",
    micromarketLabel: "Whitefield Tech Corridor",
    propertyType: "Modern Villa",
    status: "Under Construction",
    startingPrice: "\u20B94.20 Cr*",
    priceValue: 42000000,
    pricePerSqFt: "\u20B917,800 / sq.ft",
    configurations: "3, 4 & 5 BHK C20 / L30 Homes",
    bhkOptions: ["3 BHK", "4 BHK", "5+ BHK"],
    landParcel: "34.5 Acres",
    totalUnits: 650,
    possession: "2027",
    towerHeight: "Earth-Sheltered & High Rise Towers",
    reraId: "PRM/KA/RERA/1251/446/PR/171014/000433",
    featured: true,
    badges: ["Lakefront Luxury", "Biophilic Architecture", "Whitefield Prime"],
    heroImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Located on the edge of a serene natural lake in Whitefield, Pursuit of a Radical Rhapsody offers earth-sheltered homes with open terrace gardens, wire-cut brickwork, and biophilic interior spaces.",
    longDescription: "Includes cantilevered heated lap pools, board walks along the natural lake, cobblestone driveways, and high thermal efficiency design.",
    highlights: [
      "Direct boardwalk frontage on 25-acre natural lake",
      "Step-up landscaped private terrace gardens for every unit",
      "Custom handcrafted furniture and Italian marble finishes",
      "Walkable access to Hoodi Metro Station"
    ],
    pricingMatrix: [
      { config: "3 BHK C20 Suite", carpetArea: "1,850 Sq. Ft.", superArea: "2,750 Sq. Ft.", price: "\u20B94.20 Cr*", availability: "Fast Selling" },
      { config: "4 BHK L30 Lakefront Villa", carpetArea: "3,200 Sq. Ft.", superArea: "4,500 Sq. Ft.", price: "\u20B97.80 Cr*", availability: "Limited" }
    ],
    amenities: [
      { category: "Recreation", list: ["Lakefront Promenade", "Heated Lap Pool", "Squash Court", "Microbrewery Style Lounge"] },
      { category: "Nature", list: ["Organic Farm Deck", "Bird Watching Tower", "Zen Reflexology Path"] }
    ],
    proximity: [
      { title: "Hoodi Metro Station", distance: "2 Mins" },
      { title: "ITPL Whitefield", distance: "5 Mins" },
      { title: "Phoenix Marketcity", distance: "10 Mins" },
      { title: "Manipal Hospital Whitefield", distance: "8 Mins" }
    ]
  },
  {
    id: "sobha-victoria-park",
    slug: "sobha-victoria-park",
    title: "Sobha Victoria Park",
    developer: "Sobha Limited",
    location: "Hennur Main Road, Bengaluru North",
    fullAddress: "Off Hennur Main Road, Near Bagalur Cross, Bengaluru - 560077",
    micromarket: "Thanisandra",
    micromarketLabel: "Hennur Victorian Corridor",
    propertyType: "Luxury Apartment",
    status: "Under Construction",
    startingPrice: "\u20B92.65 Cr*",
    priceValue: 26500000,
    pricePerSqFt: "\u20B915,200 / sq.ft",
    configurations: "2 BHK & 3 BHK Victorian Residences",
    bhkOptions: ["2 BHK", "3 BHK"],
    landParcel: "6.5 Acres",
    totalUnits: 319,
    possession: "2028",
    towerHeight: "G + 9 Floors Victorian Stature",
    reraId: "PRM/KA/RERA/1251/309/PR/220516/004886",
    featured: false,
    badges: ["Victorian Architecture", "Sobha Craftsmanship", "Airport Proximity"],
    heroImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Sobha Victoria Park is a Victorian-themed residential marvel on Hennur Main Road, offering luxury row houses and apartments with pitched roofs, ornate gables, and royal English courtyards.",
    longDescription: "Engineered with Sobha's legendary German quality benchmarks, pre-cast structural durability, and pristine landscaped gardens.",
    highlights: [
      "Authentic Victorian architecture with ornate balustrades",
      "French-window living areas overlooking gazebos",
      "Sobha in-house pre-cast structural excellence",
      "15 Mins direct corridor to Kempegowda Airport"
    ],
    pricingMatrix: [
      { config: "2 BHK Victorian Apartment", carpetArea: "1,150 Sq. Ft.", superArea: "1,600 Sq. Ft.", price: "\u20B92.65 Cr*", availability: "Available" },
      { config: "3 BHK Victorian Residence", carpetArea: "1,450 Sq. Ft.", superArea: "2,050 Sq. Ft.", price: "\u20B93.30 Cr*", availability: "Limited" }
    ],
    amenities: [
      { category: "Classic Lifestyle", list: ["Victoria Park Lawn", "Amphitheatre", "Swimming Pool", "Skating Rink"] },
      { category: "Sports", list: ["Badminton Court", "Health Club", "Jogging Track"] }
    ],
    proximity: [
      { title: "Hennur Main Road", distance: "1 Min" },
      { title: "Decathlon Hennur", distance: "6 Mins" },
      { title: "Manyata Tech Park", distance: "14 Mins" },
      { title: "Kempegowda Int. Airport", distance: "20 Mins" }
    ]
  }
];
