import heroKarakoramImg from '../assets/images/hero_karakoram_hunza_1790486845473.jpg';
import attabadPassuImg from '../assets/images/dest_attabad_passu_1790486862254.jpg';
import skarduValleyImg from '../assets/images/dest_skardu_valley_1790486879209.jpg';
import fairyMeadowsImg from '../assets/images/dest_fairy_meadows_1790486894247.jpg';
import deosaiPlainsImg from '../assets/images/dest_deosai_plains_1790486907622.jpg';

export const VISUAL_ASSETS = {
  heroKarakoram: heroKarakoramImg,
  attabadPassu: attabadPassuImg,
  skarduValley: skarduValleyImg,
  fairyMeadows: fairyMeadowsImg,
  deosaiPlains: deosaiPlainsImg,
};

export interface ItineraryDayItem {
  dayNumber?: string;
  dayTitle?: string;
  route: string;
  description: string;
  placesVisited?: string;
  activities?: string;
  meals?: string;
  overnightLocation?: string;
  hotel?: string;
  transportation?: string;
}

export interface TourFAQItem {
  question: string;
  answer: string;
}

export interface TourItem {
  id: string;
  slug: string;
  title: string;
  destination: string;
  duration: string;
  durationCategory: string;
  tourType: string;
  startingLocation?: string;
  endingLocation?: string;
  routeSummary?: string;
  destinationsCovered?: { name: string; slug: string }[];
  mealsInfo?: string;
  groupSize?: string;
  difficulty?: string;
  bestSeason?: string;
  shortDescription: string;
  overview: string;
  badge: string; // Empty unless explicitly assigned by admin
  featured: boolean;
  published?: boolean;
  bookingStatus: 'Available' | 'Limited Availability' | 'Sold Out' | 'Inquiry Only';
  pricePerPerson: number; // 0 means not yet configured -> show "Contact us for current pricing."
  couplePrice: number;
  childPrice: number;
  groupPriceNote: string;
  imageUrl: string;
  galleryImages?: string[];
  itinerary: ItineraryDayItem[];
  inclusions: string[];
  exclusions: string[];
  transportation: string;
  accommodation: string;
  faqs?: TourFAQItem[];
  relatedGuideSlugs?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface DestinationItem {
  id: string;
  slug: string;
  name: string;
  h1Title?: string;
  region: string;
  elevation?: string;
  coordinates?: { x: number; y: number }; // Stylized SVG map coordinates (0-100)
  shortDescription: string;
  description: string;
  whyVisit?: string[];
  attractions: string[];
  bestSeason: string;
  idealFor: string[];
  durationOptions?: string;
  transportInfo?: string;
  accommodationInfo?: string;
  travelTips?: string[];
  faqs?: TourFAQItem[];
  relatedDestinationSlugs?: string[];
  relatedGuideSlugs?: string[];
  imageUrl: string;
  galleryImages?: string[];
  relatedTourIds?: string[];
  seoTitle?: string;
  seoDescription?: string;
  published?: boolean;
  isConfirmedTourOffering?: boolean;
  activeTourOffering?: boolean;
}

export interface ExperienceCategoryItem {
  id: string;
  title: string;
  subtitle: string;
  idealFor?: string;
  description: string;
  tourTypeFilter: string;
  imageUrl: string;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  published?: boolean;
  publishedDate?: string;
  readTime: string;
  relatedTourSlugs?: string[];
  relatedDestinationSlugs?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface GalleryImageItem {
  id: string;
  imageUrl: string;
  caption: string;
  altText: string;
  category: string;
  destination: string;
  featured?: boolean;
  published?: boolean;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  date?: string;
  dateText?: string;
  reviewText: string;
  photoUrl?: string;
  verified: boolean;
  published?: boolean;
  source?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

/**
 * Initial Tour Catalog
 * Strictly adheres to Non-Fabrication Rule:
 * - No fabricated prices (pricePerPerson = 0 -> renders "Contact us for current pricing.")
 * - No fabricated itineraries (itinerary = [] -> renders customizable itinerary notice)
 * - No fabricated hotel names, fake reviews, or fake vehicle guarantees.
 */
export const INITIAL_TOURS: TourItem[] = [
  {
    id: 'hunza-tour',
    slug: 'hunza-tour-packages',
    title: 'Hunza Valley & Upper Karakoram Tour Package',
    destination: 'Hunza',
    duration: 'Flexible Duration (Configurable)',
    durationCategory: '4-6 Days',
    tourType: 'Family Holidays',
    startingLocation: 'Configurable (Gilgit, Islamabad, or Custom Departure)',
    endingLocation: 'Configurable per group itinerary',
    routeSummary: 'Gilgit → Rakaposhi Viewpoint → Karimabad (Central Hunza) → Attabad Lake → Passu Cones → Khunjerab Pass',
    destinationsCovered: [
      { name: 'Hunza Valley', slug: 'hunza' },
      { name: 'Karimabad', slug: 'karimabad' },
      { name: 'Attabad Lake', slug: 'attabad-lake' },
      { name: 'Passu', slug: 'passu' },
      { name: 'Khunjerab Pass', slug: 'khunjerab' },
    ],
    mealsInfo: 'Meal plans (breakfast only, half-board, or custom dining) are arranged based on your selected package preferences.',
    groupSize: 'Private Family, Couple, or Group (Upon Inquiry)',
    difficulty: 'Easy to Moderate Scenic Road Journey',
    bestSeason: 'Spring Blossom (March–April), Summer (May–September) & Autumn Foliage (October–November)',
    shortDescription:
      'Explore Karimabad, Attabad Lake, Passu Cones, and Upper Hunza with customizable private and group tour packages by Baig Treks and Tours.',
    overview:
      'Journey along the paved Karakoram Highway into the heart of Hunza Valley. This customizable Hunza tour package is planned around your travel dates and group pace—covering historic Baltit and Altit Forts in Karimabad, sunrise over Duikar, turquoise glacial waters at Attabad Lake, the jagged granite spires of Passu Cones, Hussaini Suspension Bridge, and seasonal excursions toward Khunjerab Pass.',
    badge: '',
    featured: true,
    bookingStatus: 'Inquiry Only',
    pricePerPerson: 0,
    couplePrice: 0,
    childPrice: 0,
    groupPriceNote: 'Contact for group pricing',
    imageUrl: heroKarakoramImg,
    itinerary: [],
    inclusions: [],
    exclusions: [],
    transportation: 'Private road transport along the Karakoram Highway tailored to your group size.',
    accommodation: 'Accommodation category is selected and confirmed with you prior to booking based on your budget and valley stops.',
    faqs: [
      {
        question: 'How many days are needed for a Hunza tour?',
        answer:
          'Most travelers plan 5 to 7 days for Central and Upper Hunza (Karimabad, Attabad Lake, Passu, and Khunjerab Pass) depending on whether they travel by road from Islamabad or fly directly to Gilgit.',
      },
      {
        question: 'Is this Hunza tour package suitable for families and seniors?',
        answer:
          'Yes. Because the Karakoram Highway is paved right through Karimabad, Attabad Lake, and Passu, Hunza Valley is one of the most accessible destinations in Northern Pakistan for families, children, and older travelers.',
      },
      {
        question: 'Can we customize hotel categories and departure dates?',
        answer:
          'Yes. Baig Treks and Tours customizes departure dates, vehicle size, and accommodation options according to your group’s requirements.',
      },
    ],
    relatedGuideSlugs: [
      'how-to-plan-a-hunza-trip',
      'best-time-to-visit-hunza',
      'hunza-vs-skardu',
      'what-to-pack-for-northern-pakistan',
    ],
    seoTitle: 'Hunza Tour Packages | Hunza Valley Trips & Custom Itineraries | Baig Treks and Tours',
    seoDescription:
      'Plan your Hunza Valley tour with Baig Treks and Tours. Customizable family, honeymoon, and group Hunza tour packages covering Karimabad, Attabad Lake, Passu, and Khunjerab Pass.',
  },
  {
    id: 'skardu-tour',
    slug: 'skardu-tour-packages',
    title: 'Skardu, Shigar, Khaplu & Deosai Tour Package',
    destination: 'Skardu',
    duration: 'Flexible Duration (Configurable)',
    durationCategory: '7-10 Days',
    tourType: 'Adventure Tours',
    startingLocation: 'Configurable (Skardu Airport, Islamabad Overland, or Gilgit)',
    endingLocation: 'Configurable per group itinerary',
    routeSummary: 'Skardu Valley → Shangrila & Upper Kachura Lake → Katpana Cold Desert → Shigar Valley → Khaplu Valley → Deosai Plains',
    destinationsCovered: [
      { name: 'Skardu', slug: 'skardu' },
      { name: 'Shigar Valley', slug: 'shigar' },
      { name: 'Khaplu Valley', slug: 'khaplu' },
      { name: 'Deosai Plains', slug: 'deosai' },
    ],
    mealsInfo: 'Configurable meal inclusions depending on your chosen accommodation and valley schedule.',
    groupSize: 'Private Family, Couple, or Group (Upon Inquiry)',
    difficulty: 'Easy to Moderate Mountain Valley & Plateau Travel',
    bestSeason: 'May to October (Deosai Plains typically accessible June to September)',
    shortDescription:
      'Discover Skardu Valley, Kachura Lakes, Katpana Cold Desert, Shigar, Khaplu, and Deosai Plains with tailored Skardu tour packages.',
    overview:
      'Experience the dramatic scale of Baltistan with Baig Treks and Tours. Our Skardu tour packages are tailored for families, couples, and adventure groups looking to explore Lower and Upper Kachura Lakes, the high-altitude sand dunes of Katpana and Sarfaranga, the heritage forts and orchards of Shigar and Khaplu, and seasonal 4x4 crossings of Deosai National Park.',
    badge: '',
    featured: true,
    bookingStatus: 'Inquiry Only',
    pricePerPerson: 0,
    couplePrice: 0,
    childPrice: 0,
    groupPriceNote: 'Contact for group pricing',
    imageUrl: skarduValleyImg,
    itinerary: [],
    inclusions: [],
    exclusions: [],
    transportation: 'Private valley transport plus 4x4 jeep arrangements for Deosai Plains or high-altitude side valleys when included.',
    accommodation: 'Customizable hotel stays in Skardu, Shigar, or Khaplu confirmed according to your group preference.',
    faqs: [
      {
        question: 'How many days are needed for a Skardu tour?',
        answer:
          'A focused Skardu, Shigar, and Kachura trip takes 5 to 6 days, while adding Khaplu Valley and a full day in Deosai Plains typically requires 6 to 8 days (especially if traveling overland).',
      },
      {
        question: 'When is Deosai Plains open during a Skardu trip?',
        answer:
          'Deosai Plains is a high-altitude alpine plateau (over 4,100 meters) and is generally open from mid-June through September depending on seasonal snowmelt.',
      },
      {
        question: 'Can we travel to Skardu by road or by air?',
        answer:
          'Both options are supported. We can coordinate ground transport from Skardu Airport for fly-in travelers or plan a full overland journey via the Karakoram Highway and Jaglot-Skardu Road.',
      },
    ],
    relatedGuideSlugs: [
      'how-to-plan-a-skardu-trip',
      'best-time-to-visit-skardu',
      'hunza-vs-skardu',
      'what-to-pack-for-northern-pakistan',
    ],
    seoTitle: 'Skardu Tour Packages | Skardu, Shigar, Khaplu & Deosai Trips | Baig Treks and Tours',
    seoDescription:
      'Explore Skardu tour packages with Baig Treks and Tours. Custom private, family, and group trips to Skardu Valley, Kachura Lakes, Shigar, Khaplu, and Deosai Plains.',
  },
  {
    id: 'hunza-skardu-tour',
    slug: 'hunza-skardu-tour',
    title: 'Hunza & Skardu Combined Overland Tour Package',
    destination: 'Hunza & Skardu',
    duration: 'Flexible Duration (Configurable)',
    durationCategory: '10+ Days',
    tourType: 'Road Trips',
    startingLocation: 'Configurable (Islamabad, Gilgit, or Skardu)',
    endingLocation: 'Configurable per group itinerary',
    routeSummary: 'Gilgit → Hunza Valley (Karimabad, Attabad Lake, Passu) → Jaglot-Skardu Road → Skardu, Shigar, Khaplu & Deosai',
    destinationsCovered: [
      { name: 'Hunza Valley', slug: 'hunza' },
      { name: 'Attabad Lake', slug: 'attabad-lake' },
      { name: 'Passu', slug: 'passu' },
      { name: 'Skardu', slug: 'skardu' },
      { name: 'Shigar Valley', slug: 'shigar' },
      { name: 'Deosai Plains', slug: 'deosai' },
    ],
    mealsInfo: 'Customizable meal options arranged per group itinerary.',
    groupSize: 'Private, Couple, Family, or Group (Upon Inquiry)',
    difficulty: 'Moderate Overland Expedition',
    bestSeason: 'May to November',
    shortDescription:
      'Combine the iconic valleys of Hunza and Skardu in one comprehensive overland journey through Gilgit-Baltistan.',
    overview:
      'Our signature multi-valley Hunza and Skardu tour package connects Central and Upper Hunza (Karimabad, Attabad Lake, Passu Cones, and Khunjerab Pass) with Baltistan’s highlights (Skardu, Kachura Lakes, Shigar, Khaplu, and Deosai). Designed for travelers who want to experience both major regions of Gilgit-Baltistan in a single coordinated itinerary.',
    badge: '',
    featured: true,
    bookingStatus: 'Inquiry Only',
    pricePerPerson: 0,
    couplePrice: 0,
    childPrice: 0,
    groupPriceNote: 'Contact for group pricing',
    imageUrl: attabadPassuImg,
    itinerary: [],
    inclusions: [],
    exclusions: [],
    transportation: 'Dedicated private transport along the Karakoram Highway and Jaglot-Skardu Road.',
    accommodation: 'Stays arranged in both Hunza Valley and Skardu/Baltistan based on your preferred hotel tier.',
    faqs: [
      {
        question: 'How many days are recommended for a combined Hunza and Skardu tour?',
        answer:
          'We recommend at least 8 to 12 days so your group can enjoy both Hunza Valley and Skardu without rushing long mountain drives.',
      },
      {
        question: 'How are Hunza and Skardu connected by road?',
        answer:
          'Hunza and Skardu are linked via Gilgit and the paved Jaglot-Skardu highway following the Indus River gorge.',
      },
    ],
    relatedGuideSlugs: [
      'hunza-vs-skardu',
      'how-to-plan-a-hunza-trip',
      'how-to-plan-a-skardu-trip',
      'northern-pakistan-travel-guide',
    ],
    seoTitle: 'Hunza Skardu Tour Package | Combined Gilgit-Baltistan Trip | Baig Treks and Tours',
    seoDescription:
      'Plan a combined Hunza Skardu tour package with Baig Treks and Tours. Explore Karimabad, Attabad Lake, Passu, Skardu, Shigar, Khaplu, and Deosai in one Northern Pakistan trip.',
  },
  {
    id: 'naran-kaghan-tour',
    slug: 'naran-kaghan-tour-packages',
    title: 'Naran Kaghan, Lake Saif-ul-Malook & Babusar Top Tour Package',
    destination: 'Naran Kaghan',
    duration: 'Flexible Duration (Configurable)',
    durationCategory: '4-6 Days',
    tourType: 'Family Holidays',
    startingLocation: 'Configurable (Islamabad, Lahore, or Custom Departure)',
    endingLocation: 'Configurable per group itinerary',
    routeSummary: 'Balakot → Kaghan Valley → Naran → Lake Saif-ul-Malook → Batakundi → Lulusar Lake → Babusar Top',
    destinationsCovered: [
      { name: 'Naran Kaghan', slug: 'naran-kaghan' },
      { name: 'Northern Areas of Pakistan', slug: 'northern-areas' },
    ],
    mealsInfo: 'Configurable meal arrangements based on your selected package.',
    groupSize: 'Private, Family, Couple, or Group (Upon Inquiry)',
    difficulty: 'Easy to Moderate Valley & High Pass Journey',
    bestSeason: 'May to October (Babusar Top open during summer months)',
    shortDescription:
      'Discover the pine valleys of Naran Kaghan, Lake Saif-ul-Malook, Lulusar Lake, and Babusar Top with customizable Naran tour packages.',
    overview:
      'Experience one of Pakistan’s most popular summer mountain escapes. Journey along the Kunhar River through Kaghan Valley to Naran, take a 4x4 jeep excursion to alpine Lake Saif-ul-Malook, and drive past Batakundi and Lulusar Lake to the 4,173-meter viewpoint at Babusar Top.',
    badge: '',
    featured: true,
    bookingStatus: 'Inquiry Only',
    pricePerPerson: 0,
    couplePrice: 0,
    childPrice: 0,
    groupPriceNote: 'Contact for group pricing',
    imageUrl: deosaiPlainsImg,
    itinerary: [],
    inclusions: [],
    exclusions: [],
    transportation: 'Private road transport for Naran and Babusar Top, plus local 4x4 jeep arrangement for Lake Saif-ul-Malook or Lalazar.',
    accommodation: 'Customizable stays in Naran or Batakundi arranged according to your group size and preference.',
    faqs: [
      {
        question: 'How many days are needed for a Naran Kaghan trip?',
        answer:
          'A standard Naran Kaghan, Lake Saif-ul-Malook, Lulusar Lake, and Babusar Top trip typically takes 3 to 5 days.',
      },
      {
        question: 'When is the Naran and Babusar Top road open?',
        answer:
          'Naran town usually opens in spring (May), while Babusar Top generally opens from June to October depending on snowfall.',
      },
    ],
    relatedGuideSlugs: [
      'northern-pakistan-travel-guide',
      'what-to-pack-for-northern-pakistan',
    ],
    seoTitle: 'Naran Kaghan Tour Packages | Naran, Saif-ul-Malook & Babusar Trips | Baig Treks and Tours',
    seoDescription:
      'Explore Naran Kaghan tour packages with Baig Treks and Tours. Customizable family, couple, and group tours to Naran, Lake Saif-ul-Malook, Lulusar Lake, and Babusar Top.',
  },
  {
    id: 'kashmir-tour',
    slug: 'kashmir-tour-packages',
    title: 'Kashmir & Neelum Valley Tour Package: Keran, Sharda & Arang Kel',
    destination: 'Kashmir',
    duration: 'Flexible Duration (Configurable)',
    durationCategory: '4-6 Days',
    tourType: 'Family Holidays',
    startingLocation: 'Configurable (Islamabad, Muzaffarabad, or Custom Departure)',
    endingLocation: 'Configurable per group itinerary',
    routeSummary: 'Muzaffarabad → Dhani Waterfall → Kutton → Keran → Upper Neelum → Sharda → Kel & Arang Kel',
    destinationsCovered: [
      { name: 'Kashmir (Neelum Valley)', slug: 'kashmir' },
      { name: 'Northern Areas of Pakistan', slug: 'northern-areas' },
    ],
    mealsInfo: 'Configurable meal options per group preference.',
    groupSize: 'Private, Family, Couple, or Group (Upon Inquiry)',
    difficulty: 'Easy to Moderate Scenic Mountain Travel',
    bestSeason: 'April to November',
    shortDescription:
      'Explore the green Himalayan valleys, cedar forests, and hilltop meadows of Azad Kashmir and Neelum Valley including Keran, Sharda, and Arang Kel.',
    overview:
      'Follow the Neelum River through lush forested gorges into the heart of Azad Kashmir. Our customizable Kashmir tour packages cover Muzaffarabad, Kutton, Keran, Upper Neelum, historic Sharda, and the scenic cable-car and forest trail up to Arang Kel meadow.',
    badge: '',
    featured: false,
    bookingStatus: 'Inquiry Only',
    pricePerPerson: 0,
    couplePrice: 0,
    childPrice: 0,
    groupPriceNote: 'Contact for group pricing',
    imageUrl: fairyMeadowsImg,
    itinerary: [],
    inclusions: [],
    exclusions: [],
    transportation: 'Private road transport to Neelum Valley plus local 4x4 jeep transfers for upper valley segments where required.',
    accommodation: 'Customizable resort or guesthouse stays in Keran, Upper Neelum, Sharda, or Arang Kel.',
    faqs: [
      {
        question: 'How many days are ideal for a Neelum Valley Kashmir tour?',
        answer:
          'A comfortable trip covering Keran, Upper Neelum, Sharda, and Arang Kel takes 3 to 5 days from Islamabad.',
      },
      {
        question: 'How do travelers reach Arang Kel?',
        answer:
          'Travelers drive to Kel, cross the river gorge via the chairlift/cable car, and take a short scenic forest walk to reach the hilltop meadow of Arang Kel.',
      },
    ],
    relatedGuideSlugs: [
      'northern-pakistan-travel-guide',
      'what-to-pack-for-northern-pakistan',
    ],
    seoTitle: 'Kashmir Tour Packages | Neelum Valley, Sharda & Arang Kel Trips | Baig Treks and Tours',
    seoDescription:
      'Discover Kashmir tour packages with Baig Treks and Tours. Customized family, honeymoon, and group trips to Neelum Valley, Keran, Sharda, and Arang Kel in Pakistan.',
  },
  {
    id: 'naran-hunza-tour',
    slug: 'naran-hunza-tour',
    title: 'Naran Kaghan, Babusar Top & Hunza Valley Tour Package',
    destination: 'Naran & Hunza',
    duration: 'Flexible Duration (Configurable)',
    durationCategory: '7-10 Days',
    tourType: 'Family Holidays',
    startingLocation: 'Configurable (Islamabad, Lahore, or Custom Departure)',
    endingLocation: 'Configurable per group itinerary',
    routeSummary: 'Naran Kaghan → Lake Saif-ul-Malook → Lulusar Lake → Babusar Top → Gilgit → Karimabad (Hunza) → Attabad Lake → Passu & Khunjerab',
    destinationsCovered: [
      { name: 'Naran Kaghan', slug: 'naran-kaghan' },
      { name: 'Hunza Valley', slug: 'hunza' },
      { name: 'Karimabad', slug: 'karimabad' },
      { name: 'Attabad Lake', slug: 'attabad-lake' },
      { name: 'Passu', slug: 'passu' },
    ],
    mealsInfo: 'Customizable meal arrangements per package tier.',
    groupSize: 'Private Family, Couple, or Group (Upon Inquiry)',
    difficulty: 'Easy to Moderate Scenic Overland Route',
    bestSeason: 'June to October (while Babusar Top is open)',
    shortDescription:
      'Travel through Naran Kaghan, Lulusar Lake, and Babusar Top into Hunza Valley, Attabad Lake, and Passu in one classic Northern Pakistan route.',
    overview:
      'One of Pakistan’s most popular summer overland routes combines the lush alpine scenery of Naran Kaghan and Babusar Top with the dramatic Karakoram peaks of Hunza Valley. Break your journey comfortably in Naran before crossing Babusar Pass to join the Karakoram Highway toward Rakaposhi, Karimabad, Attabad Lake, and Passu.',
    badge: '',
    featured: false,
    bookingStatus: 'Inquiry Only',
    pricePerPerson: 0,
    couplePrice: 0,
    childPrice: 0,
    groupPriceNote: 'Contact for group pricing',
    imageUrl: heroKarakoramImg,
    itinerary: [],
    inclusions: [],
    exclusions: [],
    transportation: 'Private air-conditioned vehicle for the complete Naran, Babusar Top, and Hunza Valley circuit.',
    accommodation: 'Stays arranged in Naran Kaghan and Hunza Valley according to your preferred hotel category.',
    faqs: [
      {
        question: 'Why combine Naran Kaghan with Hunza Valley?',
        answer:
          'During summer when Babusar Top is open, traveling via Naran and Babusar Pass breaks the overland drive into scenic stages and lets you visit Lake Saif-ul-Malook and Lulusar Lake on the way to Hunza.',
      },
      {
        question: 'How many days are needed for a Naran and Hunza tour?',
        answer:
          'Most families and groups plan 6 to 8 days to comfortably cover Naran, Babusar Top, Central Hunza (Karimabad), and Upper Hunza (Attabad Lake and Passu).',
      },
    ],
    relatedGuideSlugs: [
      'how-to-plan-a-hunza-trip',
      'best-time-to-visit-hunza',
      'northern-pakistan-travel-guide',
    ],
    seoTitle: 'Naran Hunza Tour Package | Naran, Babusar Top & Hunza Trip | Baig Treks and Tours',
    seoDescription:
      'Book a combined Naran Hunza tour package with Baig Treks and Tours. Travel through Naran Kaghan, Lulusar Lake, and Babusar Top to Karimabad, Attabad Lake, and Passu.',
  },
  {
    id: 'naran-skardu-tour',
    slug: 'naran-skardu-tour',
    title: 'Naran Kaghan, Babusar Top, Deosai & Skardu Tour Package',
    destination: 'Naran & Skardu',
    duration: 'Flexible Duration (Configurable)',
    durationCategory: '7-10 Days',
    tourType: 'Adventure Tours',
    startingLocation: 'Configurable (Islamabad, Lahore, or Custom Departure)',
    endingLocation: 'Configurable per group itinerary',
    routeSummary: 'Naran Kaghan → Lulusar Lake → Babusar Top → Jaglot-Skardu Road (or Astore/Deosai) → Skardu Valley → Shigar & Khaplu',
    destinationsCovered: [
      { name: 'Naran Kaghan', slug: 'naran-kaghan' },
      { name: 'Skardu', slug: 'skardu' },
      { name: 'Shigar Valley', slug: 'shigar' },
      { name: 'Khaplu Valley', slug: 'khaplu' },
      { name: 'Deosai Plains', slug: 'deosai' },
    ],
    mealsInfo: 'Customizable meal plans based on group preferences.',
    groupSize: 'Private Family, Couple, or Group (Upon Inquiry)',
    difficulty: 'Moderate Overland Mountain Journey',
    bestSeason: 'June to October',
    shortDescription:
      'Connect Naran Kaghan and Babusar Top with Skardu Valley, Kachura Lakes, Shigar, Khaplu, and Deosai Plains on a tailored overland expedition.',
    overview:
      'Designed for overland travelers starting from Islamabad or Punjab, this combined Naran and Skardu tour package uses Naran Kaghan and Babusar Top as a scenic transit stop before descending to the Indus River and continuing along the paved Jaglot-Skardu Road (or via Astore and Deosai in summer) into Baltistan.',
    badge: '',
    featured: false,
    bookingStatus: 'Inquiry Only',
    pricePerPerson: 0,
    couplePrice: 0,
    childPrice: 0,
    groupPriceNote: 'Contact for group pricing',
    imageUrl: skarduValleyImg,
    itinerary: [],
    inclusions: [],
    exclusions: [],
    transportation: 'Private road transport via Naran and Babusar Top plus 4x4 jeep support for Deosai Plains.',
    accommodation: 'Overnight stays in Naran and Skardu/Shigar/Khaplu tailored to your group.',
    faqs: [
      {
        question: 'How many days are required for an overland Naran and Skardu trip?',
        answer:
          'We recommend 7 to 9 days for an overland Naran to Skardu tour so you have ample time in Skardu, Shigar, Khaplu, and Deosai along with comfortable overnight stops in Naran.',
      },
    ],
    relatedGuideSlugs: [
      'how-to-plan-a-skardu-trip',
      'best-time-to-visit-skardu',
      'northern-pakistan-travel-guide',
    ],
    seoTitle: 'Naran Skardu Tour Package | Overland Naran, Deosai & Skardu Trip | Baig Treks and Tours',
    seoDescription:
      'Plan a Naran Skardu tour package with Baig Treks and Tours. Overland itineraries connecting Naran Kaghan and Babusar Top with Skardu, Shigar, Khaplu, and Deosai Plains.',
  },
  {
    id: 'fairy-meadows-trek-tour',
    slug: 'fairy-meadows-trek-tour',
    title: 'Fairy Meadows & Nanga Parbat Viewpoint Trek Package',
    destination: 'Fairy Meadows',
    duration: 'Flexible Duration (Configurable)',
    durationCategory: '4-6 Days',
    tourType: 'Trekking',
    startingLocation: 'Configurable (Raikot Bridge / Islamabad / Gilgit)',
    endingLocation: 'Configurable per group itinerary',
    routeSummary: 'Karakoram Highway (Raikot Bridge) → Tato Village Jeep Track → Fairy Meadows Alpine Pasture → Beyal Camp & Nanga Parbat Viewpoint',
    destinationsCovered: [
      { name: 'Fairy Meadows', slug: 'fairy-meadows' },
      { name: 'Northern Areas of Pakistan', slug: 'northern-areas' },
    ],
    mealsInfo: 'Configurable mountain lodge or camp meal plans.',
    groupSize: 'Small Group or Private Trek',
    difficulty: 'Moderate Alpine Trekking',
    bestSeason: 'May to October',
    shortDescription:
      'Traverse the Raikot mountain jeep track and pine-scented alpine trails to stand beneath the towering Raikot Face of Nanga Parbat.',
    overview:
      'Designed for nature lovers and mountain trekkers, this journey takes you from Raikot Bridge on the Karakoram Highway up the mountain jeep track to Tato Village, followed by a scenic 3-to-4 hour forest trek to the lush alpine pastures of Fairy Meadows and Beyal Camp facing Nanga Parbat (8,126 m).',
    badge: '',
    featured: true,
    bookingStatus: 'Inquiry Only',
    pricePerPerson: 0,
    couplePrice: 0,
    childPrice: 0,
    groupPriceNote: 'Contact for group pricing',
    imageUrl: fairyMeadowsImg,
    itinerary: [],
    inclusions: [],
    exclusions: [],
    transportation: 'Road transport to Raikot Bridge plus local 4x4 mountain jeep transfer to Tato trailhead.',
    accommodation: 'Wooden alpine cabins or camping cottages at Fairy Meadows arranged per group preference.',
    faqs: [
      {
        question: 'How long is the trek to Fairy Meadows?',
        answer:
          'After the 4x4 jeep transfer from Raikot Bridge to Tato Village, the walking trail to Fairy Meadows takes approximately 3 to 4 hours at a steady pace.',
      },
      {
        question: 'Can Fairy Meadows be combined with Hunza or Skardu?',
        answer:
          'Yes. Because Raikot Bridge sits directly on the Karakoram Highway near the Jaglot junction, Fairy Meadows can easily be combined with either a Hunza tour or a Skardu tour.',
      },
    ],
    relatedGuideSlugs: [
      'what-to-pack-for-northern-pakistan',
      'northern-pakistan-travel-guide',
    ],
    seoTitle: 'Fairy Meadows & Nanga Parbat Tour Package | Baig Treks and Tours',
    seoDescription:
      'Plan your Fairy Meadows and Nanga Parbat viewpoint trek with Baig Treks and Tours. Guided alpine treks and jeep safaris in Northern Pakistan.',
  },
];

export const INITIAL_DESTINATIONS: DestinationItem[] = [
  {
    id: 'hunza',
    slug: 'hunza',
    name: 'Hunza Valley',
    h1Title: 'Hunza Tour Packages & Hunza Valley Travel Guide',
    region: 'Gilgit-Baltistan',
    elevation: '2,438 m',
    coordinates: { x: 48, y: 24 },
    shortDescription: 'Terraced orchards, ancient forts, Attabad Lake, Passu Cones, and panoramic views of Rakaposhi and Ultar Sar.',
    description:
      'Situated along the paved Karakoram Highway in Gilgit-Baltistan, Hunza Valley is celebrated for its dramatic mountain amphitheater, centuries-old Baltit and Altit forts, turquoise Attabad Lake, the jagged spires of Passu Cones, and welcoming mountain communities. Divided into Lower Hunza, Central Hunza (Karimabad), and Upper Hunza (Gojal), the valley offers smooth road access suitable for families, honeymoon couples, and road-trip groups.',
    whyVisit: [
      'Direct paved access along the Karakoram Highway through Central and Upper Hunza',
      'Historic 700+ year-old heritage architecture at Baltit Fort and Altit Fort in Karimabad',
      'Vivid turquoise glacial waters of Attabad Lake and dramatic granite peaks at Passu Cones',
      'High-altitude day excursion through Khunjerab National Park to the 4,693 m Pak-China border pass',
    ],
    attractions: [
      'Baltit Fort & Altit Fort (Karimabad)',
      'Eagle’s Nest (Duikar) Sunrise & Sunset Viewpoint',
      'Attabad Turquoise Lake',
      'Passu Cones (Tupopdan) & Passu Glacier',
      'Hussaini Suspension Bridge & Borith Lake',
      'Rakaposhi Viewpoint (Nagar Approach)',
      'Khunjerab Pass (4,693 m)',
    ],
    bestSeason: 'March to November (Spring Blossom: March–April · Summer: May–September · Autumn Foliage: October–November)',
    idealFor: ['Families', 'Honeymoon Couples', 'Private Groups', 'Photographers', 'Cultural Travelers'],
    durationOptions: 'Typically 5 to 7 days for Hunza Valley alone, or 8 to 12 days when combined with Skardu or Naran Kaghan.',
    transportInfo:
      'Accessible year-round via the Karakoram Highway (KKH), or during summer via Naran Kaghan and Babusar Top. Travelers can also fly to Gilgit Airport (1.5 to 2 hours drive from Karimabad) and continue with a private vehicle.',
    accommodationInfo:
      'Accommodation is arranged in Karimabad, Duikar, Attabad Lake, or Passu/Gulmit according to your preferred comfort tier and group size.',
    travelTips: [
      'Carry warm layers even in summer for cool evenings at Duikar and high-altitude stops like Khunjerab Pass.',
      'Spring apricot blossom peaks between late March and mid-April, while autumn golden foliage peaks in mid-to-late October.',
      'Confirm travel dates and hotel preferences in advance with Baig Treks and Tours during peak summer and October foliage weeks.',
    ],
    faqs: [
      {
        question: 'How many days are needed for Hunza Valley?',
        answer:
          'A comfortable Hunza Valley tour requires 5 to 6 days to explore Rakaposhi Viewpoint, Karimabad (Baltit & Altit Forts, Duikar), Attabad Lake, Passu Cones, Hussaini Bridge, and Khunjerab Pass.',
      },
      {
        question: 'What is the best season to visit Hunza?',
        answer:
          'Spring (late March to April) is best for orchard blossoms, May to September offers pleasant summer weather and open high passes, and October is famous for golden autumn foliage.',
      },
      {
        question: 'Can a Hunza tour be customized for families or couples?',
        answer:
          'Yes. Baig Treks and Tours customizes private family tours, honeymoon packages, and group trips with flexible pacing, private vehicles, and preferred hotel categories.',
      },
    ],
    relatedDestinationSlugs: ['skardu', 'attabad-lake', 'passu', 'khunjerab', 'karimabad', 'naran-kaghan', 'northern-areas'],
    relatedGuideSlugs: ['how-to-plan-a-hunza-trip', 'best-time-to-visit-hunza', 'hunza-vs-skardu', 'what-to-pack-for-northern-pakistan'],
    imageUrl: heroKarakoramImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
    seoTitle: 'Hunza Tour Packages & Hunza Valley Travel Guide | Baig Treks and Tours',
    seoDescription:
      'Explore Hunza tour packages with Baig Treks and Tours. Complete guide to Karimabad, Attabad Lake, Passu Cones, Khunjerab Pass, best seasons, and customized Hunza trips.',
  },
  {
    id: 'skardu',
    slug: 'skardu',
    name: 'Skardu',
    h1Title: 'Skardu Tour Packages & Baltistan Travel Guide',
    region: 'Baltistan Division, Gilgit-Baltistan',
    elevation: '2,228 m',
    coordinates: { x: 68, y: 58 },
    shortDescription: 'Gateway to the high Karakoram peaks, Shangrila & Kachura Lakes, cold deserts, Shigar, Khaplu, and Deosai Plains.',
    description:
      'Skardu sits at the wide confluence of the Indus and Shigar rivers, serving as the cultural and expedition hub of Baltistan. Surrounded by high-altitude cold desert dunes, turquoise alpine lakes, centuries-old palace forts in Shigar and Khaplu, and the vast summer wilderness of Deosai National Park, Skardu offers some of the grandest mountain scenery in Pakistan.',
    whyVisit: [
      'Diverse landscapes combining alpine lakes, high-altitude cold deserts, river valleys, and 4,100 m plateaus',
      'Iconic stops at Shangrila (Lower Kachura Lake), Upper Kachura Lake, and Katpana / Sarfaranga Cold Deserts',
      'Rich Balti architectural heritage at Shigar Fort, Khaplu Palace, and historic wooden mosques',
      'Direct summer access to Deosai National Park and Sheosar Lake',
    ],
    attractions: [
      'Shangrila Resort & Lower Kachura Lake',
      'Upper Kachura Lake & Soq Valley',
      'Katpana & Sarfaranga High-Altitude Cold Deserts',
      'Kharpocho (Skardu) Fort & Organic Village',
      'Shigar Valley & Shigar Fort',
      'Khaplu Valley, Khaplu Palace & Chaqchan Mosque',
      'Deosai Plains & Sheosar Lake',
      'Manthoka Waterfall & Basho Valley',
    ],
    bestSeason: 'May to October (Deosai Plains accessible June to September · Autumn foliage in October)',
    idealFor: ['Families', 'Couples', 'Adventure Travelers', 'Road Trippers', 'Photographers'],
    durationOptions: '5 to 7 days for Skardu, Shigar, Khaplu, and Deosai; 8 to 12 days when combined with Hunza Valley.',
    transportInfo:
      'Accessible via daily flights to Skardu Airport (weather permitting) or by road along the paved Jaglot-Skardu Highway connecting from the Karakoram Highway and Babusar Top. 4x4 jeeps are arranged for Deosai Plains and Basho Valley.',
    accommodationInfo:
      'Accommodation options range from lakeside and valley hotels in Skardu town and Kachura to heritage and orchard stays in Shigar and Khaplu, customized to your group.',
    travelTips: [
      'If visiting Deosai Plains, plan your trip between mid-June and September when snow clears from the plateau.',
      'Bring windproof layers for evening breezes near the Indus River and high-altitude crossings at Deosai.',
      'Road improvements on the Jaglot-Skardu Highway have made overland travel between Gilgit/Hunza and Skardu much smoother.',
    ],
    faqs: [
      {
        question: 'How many days are needed for Skardu?',
        answer:
          'We recommend 5 to 7 days to cover Kachura Lakes, Skardu Cold Desert, Shigar Valley, Khaplu Valley, and a day excursion across Deosai Plains.',
      },
      {
        question: 'Can we combine Skardu with Hunza in one tour?',
        answer:
          'Yes. Our Hunza & Skardu Combined Overland Tour connects both valleys via the paved Jaglot-Skardu Road in an 8 to 12 day itinerary.',
      },
      {
        question: 'How do I book a customized Skardu tour package?',
        answer:
          'You can submit your preferred dates and group size through our inquiry form or message Baig Treks and Tours directly on WhatsApp at 03155449778.',
      },
    ],
    relatedDestinationSlugs: ['hunza', 'shigar', 'khaplu', 'deosai', 'naran-kaghan', 'northern-areas'],
    relatedGuideSlugs: ['how-to-plan-a-skardu-trip', 'best-time-to-visit-skardu', 'hunza-vs-skardu', 'what-to-pack-for-northern-pakistan'],
    imageUrl: skarduValleyImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
    seoTitle: 'Skardu Tour Packages & Baltistan Travel Guide | Baig Treks and Tours',
    seoDescription:
      'Plan your Skardu tour with Baig Treks and Tours. Discover Skardu tour packages covering Shangrila, Upper Kachura Lake, Shigar, Khaplu, Cold Desert, and Deosai Plains.',
  },
  {
    id: 'naran-kaghan',
    slug: 'naran-kaghan',
    name: 'Naran Kaghan',
    h1Title: 'Naran Kaghan Tour Packages & Kaghan Valley Travel Guide',
    region: 'Kaghan Valley, Northern Pakistan',
    elevation: '2,409 m',
    coordinates: { x: 28, y: 66 },
    shortDescription: 'Alpine lakes, Kunhar River rapids, Lake Saif-ul-Malook, Lulusar Lake, and the scenic Babusar Top gateway.',
    description:
      'Naran Kaghan is one of Pakistan’s classic summer mountain corridors, stretching along the rushing Kunhar River from Balakot to the 4,173-meter crest of Babusar Top. Known for emerald pine slopes, glacial lakes like Saif-ul-Malook and Lulusar, and easy access from Islamabad and Punjab, Naran serves both as a standalone family holiday destination and as the summer overland gateway to Hunza and Skardu.',
    whyVisit: [
      'Shorter driving distance from Islamabad compared to the deeper Karakoram valleys',
      'Iconic 4x4 jeep excursion to alpine Lake Saif-ul-Malook framed by Malika Parbat',
      'Paved scenic drive past Batakundi, Lulusar Lake, and up to Babusar Top (4,173 m)',
      'Seamless summer overland connection onward to Gilgit, Hunza Valley, and Skardu',
    ],
    attractions: [
      'Lake Saif-ul-Malook',
      'Babusar Top (4,173 m)',
      'Lulusar Lake',
      'Kunhar River & Naran Bazaar',
      'Batakundi & Lalazar Meadow',
      'Shogran & Siri Paye (Lower Kaghan Corridor)',
    ],
    bestSeason: 'May to October (Babusar Top open during summer months, typically June to October)',
    idealFor: ['Families', 'Couples', 'Short Summer Breaks', 'Overland Road Trippers'],
    durationOptions: '3 to 5 days for Naran Kaghan & Babusar Top, or 7 to 10 days when combined with Hunza or Skardu.',
    transportInfo:
      'Accessible by private car, coaster, or van via the Hazara Motorway and Balakot–Naran highway, with local 4x4 jeeps arranged for Lake Saif-ul-Malook and Lalazar.',
    accommodationInfo:
      'Hotels and family guesthouses are arranged in Naran, Batakundi, or Shogran based on your group’s preferred comfort level.',
    travelTips: [
      'Start early in the morning for Lake Saif-ul-Malook and Babusar Top to enjoy clear skies and lighter traffic.',
      'Even in July and August, carry a warm jacket for the chilly winds at Babusar Top.',
    ],
    faqs: [
      {
        question: 'Can we travel from Naran Kaghan to Hunza or Skardu?',
        answer:
          'Yes. During the summer season when Babusar Top is open, Naran Kaghan is the main scenic overland route connecting to Chilas, Gilgit, Hunza Valley, and Skardu.',
      },
      {
        question: 'Is Naran Kaghan suitable for a short family trip?',
        answer:
          'Yes. A 3 to 5 day Naran Kaghan tour package is ideal for families looking for a shorter mountain holiday without multi-day highway transits.',
      },
    ],
    relatedDestinationSlugs: ['hunza', 'skardu', 'kashmir', 'fairy-meadows', 'northern-areas'],
    relatedGuideSlugs: ['northern-pakistan-travel-guide', 'what-to-pack-for-northern-pakistan'],
    imageUrl: deosaiPlainsImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
    seoTitle: 'Naran Kaghan Tour Packages & Travel Guide | Baig Treks and Tours',
    seoDescription:
      'Explore Naran Kaghan tour packages with Baig Treks and Tours. Plan family, couple, and group trips to Naran, Lake Saif-ul-Malook, Lulusar Lake, and Babusar Top.',
  },
  {
    id: 'kashmir',
    slug: 'kashmir',
    name: 'Kashmir (Neelum Valley)',
    h1Title: 'Kashmir Tour Packages & Neelum Valley Travel Guide',
    region: 'Azad Kashmir, Pakistan',
    elevation: '2,000 m',
    coordinates: { x: 42, y: 69 },
    shortDescription: 'Lush green Himalayan valleys, pine-covered ridges, and scenic villages along the Neelum River including Keran, Sharda, and Arang Kel.',
    description:
      'Azad Kashmir and the Neelum Valley offer some of the greenest alpine scenery in Pakistan. Following the winding Neelum River north of Muzaffarabad, travelers pass cascading waterfalls, dense deodar and pine forests, riverside wooden cottages in Keran and Upper Neelum, historic ruins at Sharda, and the famous hilltop meadow village of Arang Kel.',
    whyVisit: [
      'Dense Himalayan cedar and pine forests with lush green meadows',
      'Scenic riverside stays at Kutton, Keran, Upper Neelum, and Sharda',
      'Memorable cable-car crossing and short forest hike to hilltop Arang Kel',
      'Accessible year-round in lower valleys and April to November in upper Neelum',
    ],
    attractions: [
      'Arang Kel Hilltop Meadow',
      'Sharda Valley & Historic University Ruins',
      'Keran & Upper Neelum Viewpoints',
      'Kutton (Jagran) Valley & Dhani Waterfall',
      'Taobat (Upper Neelum Frontier)',
      'Ratti Gali Lake (Seasonal 4x4 & Trek Excursion)',
    ],
    bestSeason: 'April to November',
    idealFor: ['Families', 'Honeymoon Couples', 'Nature Lovers', 'Group Tours'],
    durationOptions: '3 to 5 days for Keran, Sharda & Arang Kel; 5 to 7 days if adding Taobat or Ratti Gali Lake.',
    transportInfo:
      'Private road transport from Islamabad via Muzaffarabad to Keran and Sharda, with local 4x4 jeep transfers for Kel, Taobat, or Ratti Gali tracks.',
    accommodationInfo:
      'Wooden cottages, valley resorts, and family guesthouses in Keran, Upper Neelum, Sharda, and Arang Kel.',
    travelTips: [
      'Bring original CNIC/identification documents for standard entry checkpoints along the Neelum Valley road.',
      'Wear comfortable walking shoes for the 45-to-60 minute forest walk from the Arang Kel chairlift to the main meadow.',
    ],
    faqs: [
      {
        question: 'How many days are needed for a Kashmir Neelum Valley tour?',
        answer:
          'A 3 to 5 day itinerary comfortably covers Muzaffarabad, Keran, Upper Neelum, Sharda, and Arang Kel.',
      },
      {
        question: 'Does Baig Treks and Tours arrange private family and honeymoon trips to Kashmir?',
        answer:
          'Yes. We arrange private vehicles, local jeep transfers, and customized stays in Neelum Valley for families, couples, and groups.',
      },
    ],
    relatedDestinationSlugs: ['naran-kaghan', 'hunza', 'skardu', 'northern-areas'],
    relatedGuideSlugs: ['northern-pakistan-travel-guide', 'what-to-pack-for-northern-pakistan'],
    imageUrl: fairyMeadowsImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
    seoTitle: 'Kashmir Tour Packages & Neelum Valley Guide | Baig Treks and Tours',
    seoDescription:
      'Book Kashmir tour packages with Baig Treks and Tours. Customized trips to Neelum Valley, Keran, Upper Neelum, Sharda, and Arang Kel in Pakistan.',
  },
  {
    id: 'northern-areas',
    slug: 'northern-areas',
    name: 'Northern Areas of Pakistan',
    h1Title: 'Northern Areas of Pakistan Tours & Regional Travel Guide',
    region: 'Gilgit-Baltistan & Northern Highlands, Pakistan',
    elevation: '1,500 m – 4,693 m',
    coordinates: { x: 50, y: 40 },
    shortDescription: 'Complete regional guide to Northern Pakistan tours across Gilgit-Baltistan, Hunza, Skardu, Fairy Meadows, Deosai, Naran Kaghan, and Kashmir.',
    description:
      'The Northern Areas of Pakistan—centered on Gilgit-Baltistan and its neighboring mountain corridors in Kaghan and Kashmir—represent the meeting point of three of the world’s mightiest mountain ranges: the Karakoram, the Western Himalayas, and the Hindu Kush. Baig Treks and Tours organizes private, family, honeymoon, and group journeys across these valleys, connecting travelers with Hunza, Skardu, Attabad Lake, Passu, Khunjerab Pass, Shigar, Khaplu, Deosai Plains, Fairy Meadows, Naran Kaghan, and Neelum Valley.',
    whyVisit: [
      'Confluence of the Karakoram, Himalaya, and Hindu Kush mountain ranges',
      'Paved overland road trips along the Karakoram Highway and Jaglot-Skardu Road',
      'Diverse trip styles ranging from comfortable family valley stays to alpine trekking and 4x4 plateau crossings',
      'Tailored itineraries planned around seasonal weather windows and group preferences',
    ],
    attractions: [
      'Hunza Valley, Attabad Lake & Passu Cones',
      'Skardu Valley, Kachura Lakes & Cold Desert',
      'Deosai National Park & Sheosar Lake',
      'Fairy Meadows & Nanga Parbat Viewpoint',
      'Shigar & Khaplu Heritage Valleys',
      'Khunjerab Pass (4,693 m)',
      'Naran Kaghan, Lake Saif-ul-Malook & Babusar Top',
      'Kashmir & Neelum Valley (Keran, Sharda, Arang Kel)',
    ],
    bestSeason: 'Spring (March–April), Summer (May–September) & Autumn Foliage (October–November)',
    idealFor: ['Family Holidays', 'Honeymoon Tours', 'Private Customized Tours', 'Group Expeditions', 'Trekking & Road Trips'],
    durationOptions: '4 to 6 days for single-valley trips; 7 to 12+ days for multi-valley circuits (such as Hunza + Skardu or Naran + Hunza).',
    transportInfo:
      'Coordinated private road transport from Islamabad, Gilgit, or Skardu, plus 4x4 jeeps for Deosai, Fairy Meadows (Raikot track), Naltar, and Saif-ul-Malook.',
    accommodationInfo:
      'Customizable accommodation selections arranged across every valley according to your group size and budget.',
    travelTips: [
      'Choose your destination based on available days: 4–5 days suits Naran or Kashmir, 5–7 days suits Hunza or Skardu, and 8–12 days suits a combined Hunza + Skardu circuit.',
      'Check seasonal road openings for high passes (Babusar Top and Deosai Plains are summer-only routes).',
    ],
    faqs: [
      {
        question: 'Which destination in Northern Pakistan is best for a first-time family trip?',
        answer:
          'Hunza Valley and Naran Kaghan are the most popular first-time family destinations due to paved highway access and comfortable valley elevations, followed closely by Skardu and Shigar.',
      },
      {
        question: 'How do I plan a customized Northern Areas tour in Pakistan?',
        answer:
          'Contact Baig Treks and Tours on WhatsApp (03155449778) or submit our online trip inquiry form with your travel dates, number of travelers, departure city, and preferred valleys.',
      },
    ],
    relatedDestinationSlugs: ['hunza', 'skardu', 'naran-kaghan', 'kashmir', 'fairy-meadows', 'deosai', 'attabad-lake'],
    relatedGuideSlugs: [
      'northern-pakistan-travel-guide',
      'hunza-vs-skardu',
      'how-to-plan-a-hunza-trip',
      'how-to-plan-a-skardu-trip',
      'what-to-pack-for-northern-pakistan',
    ],
    imageUrl: heroKarakoramImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
    seoTitle: 'Northern Areas Pakistan Tours | Gilgit-Baltistan, Hunza & Skardu Packages | Baig Treks and Tours',
    seoDescription:
      'Plan Northern Areas Pakistan tours with Baig Treks and Tours. Discover customizable tour packages for Gilgit-Baltistan, Hunza, Skardu, Naran Kaghan, and Kashmir.',
  },
  {
    id: 'gilgit',
    slug: 'gilgit',
    name: 'Gilgit',
    h1Title: 'Gilgit Travel Guide & Karakoram Gateway Tours',
    region: 'Gilgit Division, Gilgit-Baltistan',
    elevation: '1,500 m',
    coordinates: { x: 38, y: 42 },
    shortDescription: 'Historic crossroads of the Silk Route, fly-in airport hub, and administrative heart of Gilgit-Baltistan.',
    description:
      'Surrounded by rugged peaks where the Gilgit and Hunza rivers meet the Indus, Gilgit is the central hub connecting Hunza, Naltar, Ghizer, and Skardu.',
    attractions: ['Kargah Buddha', 'Gilgit River Suspension Bridge', 'Three Mountain Ranges Junction (Jaglot)', 'Naltar Valley Approach'],
    bestSeason: 'Year-Round',
    idealFor: ['Road Trippers', 'Cultural Explorers', 'Fly-In Travelers', 'Families'],
    relatedDestinationSlugs: ['hunza', 'naltar', 'ghizer', 'skardu'],
    relatedGuideSlugs: ['northern-pakistan-travel-guide', 'how-to-plan-a-hunza-trip'],
    imageUrl: heroKarakoramImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
    seoTitle: 'Gilgit Travel Guide & Northern Pakistan Tours | Baig Treks and Tours',
    seoDescription:
      'Explore Gilgit, the gateway to Hunza, Naltar, and Ghizer in Gilgit-Baltistan, with customized tours by Baig Treks and Tours.',
  },
  {
    id: 'attabad-lake',
    slug: 'attabad-lake',
    name: 'Attabad Lake',
    h1Title: 'Attabad Lake Travel Guide & Upper Hunza Tours',
    region: 'Upper Hunza (Gojal)',
    elevation: '2,559 m',
    coordinates: { x: 53, y: 20 },
    shortDescription: 'Brilliant turquoise glacial waters framed by sheer Karakoram rock walls along the Upper Hunza highway.',
    description:
      'One of Northern Pakistan’s most striking natural landmarks, Attabad Lake offers serene boat rides, water activities, and lakeside viewpoints along the tunnels of the Karakoram Highway in Upper Hunza.',
    attractions: ['Turquoise Lake Boating', 'Jet Skiing', 'KKH Attabad Tunnels', 'Lakeside Viewpoints'],
    bestSeason: 'April to November',
    idealFor: ['Couples', 'Families', 'Sightseers', 'Photographers'],
    relatedDestinationSlugs: ['hunza', 'passu', 'karimabad', 'khunjerab'],
    relatedGuideSlugs: ['how-to-plan-a-hunza-trip', 'best-time-to-visit-hunza'],
    imageUrl: attabadPassuImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
    seoTitle: 'Attabad Lake Hunza Tours & Travel Guide | Baig Treks and Tours',
    seoDescription:
      'Visit Attabad Lake in Upper Hunza with Baig Treks and Tours. Discover turquoise glacial waters, boating, and scenic Karakoram Highway tour packages.',
  },
  {
    id: 'passu',
    slug: 'passu',
    name: 'Passu',
    h1Title: 'Passu Cones & Upper Hunza Travel Guide',
    region: 'Gojal, Upper Hunza',
    elevation: '2,480 m',
    coordinates: { x: 56, y: 15 },
    shortDescription: 'Home to the iconic jagged Passu Cones (Tupopdan), Hussaini Suspension Bridge, and Passu Glacier.',
    description:
      'Passu is an unforgettable stop along the Upper Hunza riverbed in Gojal, dominated by cathedral-like granite spires (Tupopdan) that glow gold at sunrise and sunset.',
    attractions: ['Passu Cathedral Cones (Tupopdan)', 'Hussaini Suspension Bridge', 'Passu Glacier Viewpoint', 'Borith Lake'],
    bestSeason: 'April to November',
    idealFor: ['Photographers', 'Road Trippers', 'Nature Lovers', 'Families'],
    relatedDestinationSlugs: ['hunza', 'attabad-lake', 'khunjerab', 'karimabad'],
    relatedGuideSlugs: ['how-to-plan-a-hunza-trip', 'best-time-to-visit-hunza'],
    imageUrl: attabadPassuImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
    seoTitle: 'Passu Cones & Hussaini Bridge Tours (Upper Hunza) | Baig Treks and Tours',
    seoDescription:
      'Explore Passu Cones, Hussaini Suspension Bridge, Borith Lake, and Passu Glacier in Upper Hunza with Baig Treks and Tours.',
  },
  {
    id: 'khunjerab',
    slug: 'khunjerab',
    name: 'Khunjerab Pass',
    h1Title: 'Khunjerab Pass (4,693 m) Travel Guide & Hunza Excursions',
    region: 'Upper Gojal, Hunza',
    elevation: '4,693 m',
    coordinates: { x: 60, y: 8 },
    shortDescription: 'High-altitude paved mountain pass at the northern frontier of Pakistan in Khunjerab National Park.',
    description:
      'Surrounded by snow-dusted alpine meadows and Khunjerab National Park wildlife habitats, Khunjerab Pass marks the northern culmination of the Karakoram Highway at 4,693 meters.',
    attractions: ['Pak-China Border Monument', 'Khunjerab National Park', 'High-Altitude Karakoram Highway Drive'],
    bestSeason: 'May to November',
    idealFor: ['Road Trippers', 'Adventure Travelers', 'Families'],
    relatedDestinationSlugs: ['hunza', 'passu', 'attabad-lake'],
    relatedGuideSlugs: ['how-to-plan-a-hunza-trip', 'what-to-pack-for-northern-pakistan'],
    imageUrl: heroKarakoramImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
    seoTitle: 'Khunjerab Pass Tour & Travel Guide | Upper Hunza | Baig Treks and Tours',
    seoDescription:
      'Plan a day excursion to Khunjerab Pass (4,693 m) and Khunjerab National Park during your Hunza tour with Baig Treks and Tours.',
  },
  {
    id: 'karimabad',
    slug: 'karimabad',
    name: 'Karimabad',
    h1Title: 'Karimabad Travel Guide — Central Hunza Heritage & Viewpoints',
    region: 'Central Hunza',
    elevation: '2,500 m',
    coordinates: { x: 46, y: 27 },
    shortDescription: 'Cultural heart of Hunza overlooking Rakaposhi, Diran, and Ultar peaks.',
    description:
      'Karimabad blends centuries-old Baltit and Altit architectural heritage with vibrant bazaars, local cafes, and panoramic viewpoints at Duikar.',
    attractions: ['Baltit Heritage Fort', 'Altit Fort & Royal Garden', 'Karimabad Stone Street', 'Duikar (Eagle’s Nest) Sunrise'],
    bestSeason: 'March to November',
    idealFor: ['Families', 'Honeymooners', 'History & Culture Enthusiasts'],
    relatedDestinationSlugs: ['hunza', 'attabad-lake', 'passu', 'gilgit'],
    relatedGuideSlugs: ['how-to-plan-a-hunza-trip', 'best-time-to-visit-hunza'],
    imageUrl: heroKarakoramImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
    seoTitle: 'Karimabad Hunza Travel Guide | Baltit Fort & Duikar | Baig Treks and Tours',
    seoDescription:
      'Explore Karimabad in Central Hunza with Baig Treks and Tours. Visit Baltit Fort, Altit Fort, Duikar Eagle’s Nest, and scenic Karakoram viewpoints.',
  },
  {
    id: 'shigar',
    slug: 'shigar',
    name: 'Shigar Valley',
    h1Title: 'Shigar Valley Travel Guide & Baltistan Heritage Tours',
    region: 'Baltistan',
    elevation: '2,260 m',
    coordinates: { x: 72, y: 48 },
    shortDescription: 'Orchard-filled valley along the Shigar River featuring Shigar Fort and Sarfaranga Cold Desert.',
    description:
      'Known for its historic wooden and stone architecture, apricot groves, Sarfaranga Cold Desert, and dramatic riverbeds, Shigar offers a tranquil cultural experience near Skardu.',
    attractions: ['Shigar Fort (Fong-Khar)', 'Amburiq Wooden Mosque', 'Sarfaranga Cold Desert', 'Blind Lake (Jarba Zhou)'],
    bestSeason: 'May to October',
    idealFor: ['Families', 'Heritage Travelers', 'Couples'],
    relatedDestinationSlugs: ['skardu', 'khaplu', 'deosai'],
    relatedGuideSlugs: ['how-to-plan-a-skardu-trip', 'best-time-to-visit-skardu'],
    imageUrl: skarduValleyImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
    seoTitle: 'Shigar Valley & Shigar Fort Tours (Skardu) | Baig Treks and Tours',
    seoDescription:
      'Visit Shigar Valley, Shigar Fort, Amburiq Mosque, and Sarfaranga Cold Desert during your Skardu tour with Baig Treks and Tours.',
  },
  {
    id: 'khaplu',
    slug: 'khaplu',
    name: 'Khaplu Valley',
    h1Title: 'Khaplu Valley Travel Guide — Shyok River & Heritage Palaces',
    region: 'Ghanche District, Baltistan',
    elevation: '2,600 m',
    coordinates: { x: 84, y: 56 },
    shortDescription: 'Scenic eastern Baltistan valley along the Shyok River with Khaplu Palace and Masherbrum views.',
    description:
      'Khaplu is renowned for its peaceful villages along the Shyok River, Yabgo Khar (Khaplu Palace), Chaqchan Mosque, and winding mountain roads framed by towering granite peaks.',
    attractions: ['Khaplu Palace (Yabgo Khar)', 'Chaqchan Mosque', 'Saling & Shyok Confluence', 'Machulo Viewpoint'],
    bestSeason: 'May to October',
    idealFor: ['Cultural Travelers', 'Families', 'Photographers'],
    relatedDestinationSlugs: ['skardu', 'shigar', 'deosai'],
    relatedGuideSlugs: ['how-to-plan-a-skardu-trip', 'best-time-to-visit-skardu'],
    imageUrl: deosaiPlainsImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
    seoTitle: 'Khaplu Valley & Khaplu Palace Tours (Baltistan) | Baig Treks and Tours',
    seoDescription:
      'Discover Khaplu Valley, Khaplu Palace, and Chaqchan Mosque in eastern Baltistan with customized Skardu and Khaplu tours by Baig Treks and Tours.',
  },
  {
    id: 'deosai',
    slug: 'deosai',
    name: 'Deosai Plains',
    h1Title: 'Deosai Plains & Sheosar Lake Travel Guide',
    region: 'Skardu / Astore Border',
    elevation: '4,114 m',
    coordinates: { x: 58, y: 68 },
    shortDescription: 'Legendary high-altitude alpine plateau carpeted with summer wildflowers, crystal streams, and Sheosar Lake.',
    description:
      'Spanning thousands of square kilometers between Skardu and Astore at over 4,100 meters, Deosai National Park offers boundless alpine horizons, Sheosar Lake, Bara Pani, and crisp mountain air during the summer window.',
    attractions: ['Sheosar Lake', 'Bara Pani Crossing', 'Kala Pani', 'Deosai National Park Landscapes'],
    bestSeason: 'Mid-June to September',
    idealFor: ['Adventure Travelers', 'Nature Lovers', '4x4 Expeditions', 'Photographers'],
    relatedDestinationSlugs: ['skardu', 'astore', 'shigar'],
    relatedGuideSlugs: ['how-to-plan-a-skardu-trip', 'best-time-to-visit-skardu', 'what-to-pack-for-northern-pakistan'],
    imageUrl: deosaiPlainsImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
    seoTitle: 'Deosai Plains & Sheosar Lake Tours | Skardu & Astore | Baig Treks and Tours',
    seoDescription:
      'Experience a 4x4 journey across Deosai Plains and Sheosar Lake between Skardu and Astore with Baig Treks and Tours.',
  },
  {
    id: 'astore',
    slug: 'astore',
    name: 'Astore Valley',
    h1Title: 'Astore Valley & Rama Meadow Travel Guide',
    region: 'Diamer Division, Gilgit-Baltistan',
    elevation: '2,600 m',
    coordinates: { x: 46, y: 66 },
    shortDescription: 'Lush green side valleys, Rama Meadow, and eastern approaches to Nanga Parbat and Deosai.',
    description:
      'Astore features pine forests, Rama Lake, and dramatic mountain roads connecting the Karakoram Highway to Deosai Plains and the Rupal face of Nanga Parbat.',
    attractions: ['Rama Meadow & Rama Lake', 'Minimerg & Rainbow Lake (Subject to Permit)', 'Chilim & Deosai Approach'],
    bestSeason: 'May to October',
    idealFor: ['Nature Lovers', 'Trekkers', 'Jeep Safari Enthusiasts'],
    relatedDestinationSlugs: ['deosai', 'fairy-meadows', 'skardu'],
    relatedGuideSlugs: ['northern-pakistan-travel-guide', 'what-to-pack-for-northern-pakistan'],
    imageUrl: fairyMeadowsImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
    seoTitle: 'Astore Valley & Rama Lake Tours | Gilgit-Baltistan | Baig Treks and Tours',
    seoDescription:
      'Explore Astore Valley, Rama Meadow, and the western approach to Deosai Plains with Baig Treks and Tours.',
  },
  {
    id: 'naltar',
    slug: 'naltar',
    name: 'Naltar Valley',
    h1Title: 'Naltar Valley & Satrangi Lake Travel Guide',
    region: 'Hunza-Nagar / Gilgit Approach',
    elevation: '2,900 m',
    coordinates: { x: 39, y: 31 },
    shortDescription: 'Forested alpine valley famous for multi-colored glacial lakes and spruce slopes near Gilgit.',
    description:
      'Accessible via mountain track from Nomal between Gilgit and Hunza, Naltar captivates travelers with dense pine forests and jewel-toned alpine lakes.',
    attractions: ['Satrangi (Seven-Color) Lake', 'Blue Lake (Pari Lake)', 'Pine & Spruce Forests'],
    bestSeason: 'June to October & Winter Snow Season',
    idealFor: ['Adventure Travelers', 'Photographers', 'Day Excursions from Gilgit/Hunza'],
    relatedDestinationSlugs: ['gilgit', 'hunza', 'karimabad'],
    relatedGuideSlugs: ['how-to-plan-a-hunza-trip', 'what-to-pack-for-northern-pakistan'],
    imageUrl: fairyMeadowsImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
    seoTitle: 'Naltar Valley & Satrangi Lake Tours | Gilgit-Baltistan | Baig Treks and Tours',
    seoDescription:
      'Plan a 4x4 excursion to Naltar Valley, Satrangi Lake, and Blue Lake near Gilgit and Hunza with Baig Treks and Tours.',
  },
  {
    id: 'fairy-meadows',
    slug: 'fairy-meadows',
    name: 'Fairy Meadows',
    h1Title: 'Fairy Meadows & Nanga Parbat Trekking Guide',
    region: 'Diamer District, Gilgit-Baltistan',
    elevation: '3,300 m',
    coordinates: { x: 34, y: 58 },
    shortDescription: 'Iconic alpine grassland directly facing the snow wall of Nanga Parbat (8,126 m).',
    description:
      'Reached by a mountain jeep track from Raikot Bridge and a scenic pine forest trail, Fairy Meadows offers unforgettable alpine cabin stays, Beyal Camp walks, and close-up views of Nanga Parbat, the ninth-highest mountain on Earth.',
    attractions: ['Raikot Jeep Track to Tato', 'Fairy Meadows Alpine Pasture', 'Beyal Camp Trail', 'Nanga Parbat Viewpoint & Reflection Pond'],
    bestSeason: 'May to October',
    idealFor: ['Trekkers', 'Campers', 'Mountain Photographers', 'Adventure Groups'],
    relatedDestinationSlugs: ['hunza', 'skardu', 'astore', 'naran-kaghan'],
    relatedGuideSlugs: ['what-to-pack-for-northern-pakistan', 'northern-pakistan-travel-guide'],
    imageUrl: fairyMeadowsImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
    seoTitle: 'Fairy Meadows & Nanga Parbat Tours | Trekking Guide | Baig Treks and Tours',
    seoDescription:
      'Explore Fairy Meadows and Nanga Parbat viewpoint trek packages with Baig Treks and Tours. Complete guide to the Raikot jeep track, trail, and best seasons.',
  },
  {
    id: 'ghizer',
    slug: 'ghizer',
    name: 'Ghizer Valley',
    h1Title: 'Ghizer & Phander Valley Travel Guide',
    region: 'Western Gilgit-Baltistan',
    elevation: '2,100 m',
    coordinates: { x: 22, y: 34 },
    shortDescription: 'Crystal-clear rivers, Phander Lake, Khalti Lake, and serene autumn foliage west of Gilgit.',
    description:
      'Stretching west from Gilgit toward Shandur, Ghizer is a peaceful corridor of turquoise rivers, trout streams, Phander Lake, and welcoming mountain villages.',
    attractions: ['Phander Lake', 'Khalti Lake', 'Gupis Valley', 'Shandur Pass Approach'],
    bestSeason: 'April to November',
    idealFor: ['Road Trippers', 'Nature Lovers', 'Autumn Foliage Seekers'],
    relatedDestinationSlugs: ['gilgit', 'hunza', 'naltar'],
    relatedGuideSlugs: ['northern-pakistan-travel-guide', 'what-to-pack-for-northern-pakistan'],
    imageUrl: attabadPassuImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
    seoTitle: 'Ghizer & Phander Valley Tours | Gilgit-Baltistan | Baig Treks and Tours',
    seoDescription:
      'Explore Ghizer Valley, Phander Lake, and Khalti Lake in Gilgit-Baltistan with Baig Treks and Tours.',
  },
];

export const INITIAL_EXPERIENCES: ExperienceCategoryItem[] = [
  {
    id: 'exp-family',
    title: 'FAMILY HOLIDAYS',
    subtitle: 'Comfortable Pacing & Scenic Valleys',
    description:
      'Thoughtfully paced family tour packages through Hunza, Skardu, Naran Kaghan, and Kashmir designed for multi-generational families seeking comfort and smooth logistics.',
    tourTypeFilter: 'Family Holidays',
    imageUrl: heroKarakoramImg,
  },
  {
    id: 'exp-honeymoon',
    title: 'HONEYMOON TOURS',
    subtitle: 'Private Vistas & Serene Retreats',
    description:
      'Private couple itineraries featuring lakeside views at Attabad and Kachura, quiet valley evenings, and flexible daily schedules.',
    tourTypeFilter: 'Honeymoon Tours',
    imageUrl: attabadPassuImg,
  },
  {
    id: 'exp-adventure',
    title: 'ADVENTURE TOURS',
    subtitle: 'High Passes, Cold Deserts & Plateaus',
    description:
      'Explore high-altitude plateaus in Deosai, mountain jeep tracks in Naltar and Astore, and rugged Karakoram landscapes.',
    tourTypeFilter: 'Adventure Tours',
    imageUrl: skarduValleyImg,
  },
  {
    id: 'exp-trekking',
    title: 'TREKKING',
    subtitle: 'Alpine Trails & Basecamp Approaches',
    description:
      'Guided walking and trekking routes to Fairy Meadows, Beyal Camp, Nanga Parbat viewpoints, and scenic glacial valleys.',
    tourTypeFilter: 'Trekking',
    imageUrl: fairyMeadowsImg,
  },
  {
    id: 'exp-cultural',
    title: 'CULTURAL TOURS',
    subtitle: 'Heritage Forts, Villages & Local Cuisine',
    description:
      'Connect with the living heritage, architecture, and traditional flavors of Hunza, Shigar, Khaplu, and Gilgit.',
    tourTypeFilter: 'Cultural Trips',
    imageUrl: heroKarakoramImg,
  },
  {
    id: 'exp-roadtrips',
    title: 'ROAD TRIPS',
    subtitle: 'The Legendary Karakoram Highway',
    description:
      'Overland drives along river gorges, suspension bridges, Babusar Top, and mountain passes from Naran and Gilgit to Khunjerab and Skardu.',
    tourTypeFilter: 'Road Trips',
    imageUrl: attabadPassuImg,
  },
  {
    id: 'exp-private',
    title: 'PRIVATE TOURS',
    subtitle: 'Dedicated Vehicle & Personal Schedule',
    description:
      'Travel exclusively with your own family or group with dedicated transport and customized stops across Northern Pakistan.',
    tourTypeFilter: 'Private Tours',
    imageUrl: deosaiPlainsImg,
  },
  {
    id: 'exp-custom',
    title: 'CUSTOM TOURS',
    subtitle: 'Built Around Your Dates & Interests',
    description:
      'Share your preferred valleys, travel dates, and group size with Baig Treks and Tours for a bespoke Pakistan tour itinerary.',
    tourTypeFilter: 'Custom Tours',
    imageUrl: skarduValleyImg,
  },
];

export const INITIAL_BLOG_POSTS: BlogPostItem[] = [
  {
    id: 'guide-best-time-hunza',
    slug: 'best-time-to-visit-hunza',
    title: 'Best Time to Visit Hunza Valley: Seasons, Weather & Road Guide',
    category: 'Seasonal Planning',
    excerpt:
      'From late-March apricot blossoms and pleasant summer road trips to the golden autumn trees of October, learn when to plan your Hunza Valley tour.',
    content: `Hunza Valley transforms dramatically with each season of the year. Choosing the right window for your Hunza tour depends on whether your group prioritizes spring orchard blossoms, warm summer days with open high passes, or crisp autumn foliage for photography.

1. Spring Blossom Season (Late March to Mid-April)
Across Central and Lower Hunza (Karimabad, Altit, Ganish, and Nagar), apricot, cherry, almond, and apple trees bloom against snow-covered Karakoram peaks. Daytime temperatures are mild and comfortable for sightseeing around Baltit and Altit Forts, while evenings require a warm fleece or jacket.

2. Summer High Season (May to September)
Summer brings long daylight hours, green terraced orchards, and full accessibility up the Karakoram Highway through Attabad Lake, Passu, and Khunjerab Pass (4,693 m). During June through September, the Babusar Top route via Naran Kaghan is also open, making summer the most popular window for family holidays and overland road trips.

3. Autumn Foliage Season (October to Early November)
In October, poplar and fruit trees along the Hunza River gorge turn brilliant shades of yellow, amber, and crimson. Skies are typically clear with sharp visibility of Rakaposhi, Ultar Sar, and the Passu Cones.

4. Winter Quiet Season (December to February)
Winter is cold and peaceful. While Karakoram Highway access to Karimabad and Attabad Lake remains open for most of the season, high passes and Babusar Top are closed due to snow, and travelers must pack heavy thermal layers.

Contact Baig Treks and Tours on WhatsApp (03155449778) to check current road and weather updates for your preferred Hunza travel dates.`,
    imageUrl: heroKarakoramImg,
    published: true,
    publishedDate: '2026',
    readTime: '6 min read',
    relatedTourSlugs: ['hunza-tour-packages', 'hunza-skardu-tour', 'naran-hunza-tour'],
    relatedDestinationSlugs: ['hunza', 'attabad-lake', 'passu', 'karimabad'],
    seoTitle: 'Best Time to Visit Hunza Valley | Seasonal Weather & Road Guide | Baig Treks and Tours',
    seoDescription:
      'Discover the best time to visit Hunza Valley. Compare spring apricot blossom, summer family road trips, and October autumn foliage in Gilgit-Baltistan.',
  },
  {
    id: 'guide-best-time-skardu',
    slug: 'best-time-to-visit-skardu',
    title: 'Best Time to Visit Skardu, Shigar, Khaplu & Deosai Plains',
    category: 'Seasonal Planning',
    excerpt:
      'Understand the seasonal windows for Skardu Valley, Kachura Lakes, Shigar, Khaplu, and when snow clears on the high-altitude plateau of Deosai.',
    content: `Skardu and the wider Baltistan region feature diverse elevations—from Skardu town and Shigar Valley at roughly 2,200 meters up to Deosai National Park above 4,100 meters. Planning the right month ensures the places you want to see are accessible.

1. Peak Summer & Deosai Window (Mid-June to September)
If visiting Deosai Plains and Sheosar Lake is a priority for your group, plan your Skardu trip between mid-June and September. During these months, snow clears from the high plateau, wildflowers bloom along alpine streams, and both the Skardu-Deosai and Astore-Deosai jeep tracks are open.

2. Late Spring & Early Summer (April to Early June)
Lower valleys—including Shangrila (Lower Kachura Lake), Upper Kachura Lake, Katpana Cold Desert, Shigar Fort, and Khaplu Palace—are pleasant and green in May and early June, though Deosai Plains may still be snowbound until mid-June.

3. Autumn Foliage in Baltistan (October to Early November)
October is one of the most scenic months in Skardu, Shigar, and Khaplu. Apricot and poplar groves turn golden yellow against granite mountains and desert sand dunes, and road traffic is lighter than in peak summer.

Reach out to Baig Treks and Tours on WhatsApp to confirm current flight and road conditions for your Skardu tour package.`,
    imageUrl: skarduValleyImg,
    published: true,
    publishedDate: '2026',
    readTime: '6 min read',
    relatedTourSlugs: ['skardu-tour-packages', 'hunza-skardu-tour', 'naran-skardu-tour'],
    relatedDestinationSlugs: ['skardu', 'shigar', 'khaplu', 'deosai'],
    seoTitle: 'Best Time to Visit Skardu & Deosai Plains | Baltistan Seasonal Guide | Baig Treks and Tours',
    seoDescription:
      'Find out the best time to visit Skardu, Shigar, Khaplu, and Deosai Plains. Seasonal weather guide for summer plateau crossings and autumn foliage in Baltistan.',
  },
  {
    id: 'guide-hunza-vs-skardu',
    slug: 'hunza-vs-skardu',
    title: 'Hunza vs Skardu: Which Northern Pakistan Destination Should You Choose?',
    category: 'Trip Planning',
    excerpt:
      'Comparing road accessibility, scenery, travel pace, family suitability, and duration requirements between Hunza Valley and Skardu.',
    content: `One of the most common questions travelers ask when planning a Northern Pakistan trip is whether to choose Hunza Valley, Skardu, or combine both in one itinerary. Both regions lie in Gilgit-Baltistan, yet they offer distinct landscapes and travel experiences.

1. Road Accessibility & Driving Pace
• Hunza Valley: The paved Karakoram Highway runs directly through Lower, Central, and Upper Hunza. Once you reach Karimabad, attractions like Baltit Fort, Attabad Lake, Passu Cones, and Khunjerab Pass are connected along a single smooth highway corridor.
• Skardu & Baltistan: The paved Jaglot-Skardu Road connects the Karakoram Highway to Skardu town. However, Baltistan is geographically wider—visiting Shigar Valley, Khaplu Valley, Basho, and Deosai Plains involves branching out into separate valleys, and Deosai requires a 4x4 vehicle.

2. Landscape & Atmosphere
• Choose Hunza if: You love terraced mountain villages overlooking towering peaks (Rakaposhi and Ultar Sar), vibrant cafes and bazaars in Karimabad, turquoise boating on Attabad Lake, and the dramatic granite spires of Passu.
• Choose Skardu if: You are drawn to vast, contrasting scale—wide Indus River plains, high-altitude cold desert sand dunes right beside snow peaks, serene alpine lakes (Upper and Lower Kachura), historic royal palaces in Shigar and Khaplu, and the high-altitude wilderness of Deosai.

3. Recommended Duration
• 5 to 6 Days Available: Choose either a dedicated Hunza tour package or a dedicated Skardu tour package so you don't spend your entire holiday driving.
• 8 to 12+ Days Available: Combine both on a Hunza & Skardu Combined Overland Tour to experience the full breadth of Gilgit-Baltistan.

Message Baig Treks and Tours on WhatsApp (03155449778) with your available days and group size for a tailored recommendation.`,
    imageUrl: deosaiPlainsImg,
    published: true,
    publishedDate: '2026',
    readTime: '6 min read',
    relatedTourSlugs: ['hunza-tour-packages', 'skardu-tour-packages', 'hunza-skardu-tour'],
    relatedDestinationSlugs: ['hunza', 'skardu', 'northern-areas'],
    seoTitle: 'Hunza vs Skardu: Complete Travel Comparison | Baig Treks and Tours',
    seoDescription:
      'Compare Hunza Valley vs Skardu for family holidays, honeymoons, and road trips in Northern Pakistan. Learn about road conditions, scenery, and ideal trip durations.',
  },
  {
    id: 'guide-plan-skardu-trip',
    slug: 'how-to-plan-a-skardu-trip',
    title: 'How to Plan a Skardu Trip: Routes, Valleys, Duration & Practical Tips',
    category: 'Destination Guide',
    excerpt:
      'A step-by-step planning guide to Skardu, Kachura Lakes, Katpana Cold Desert, Shigar, Khaplu, and Deosai Plains.',
    content: `Planning a trip to Skardu and Baltistan rewards travelers who structure their days by valley corridor. Because Baltistan spans multiple valleys along the Indus, Shigar, and Shyok rivers, grouping nearby attractions keeps daily driving comfortable.

1. Decide Between Fly-In or Overland Travel
• By Air: Flights operate to Skardu Airport (weather permitting). Flying saves two days of highway driving each way, allowing you to focus a 5-to-6 day trip entirely inside Skardu, Shigar, Khaplu, and Deosai.
• By Road: Overland travelers drive from Islamabad via Hazara Motorway and either Babusar Top (in summer) or Besham/Dassu along the Karakoram Highway, turning onto the paved Jaglot-Skardu Road near Astak/Alam Bridge.

2. Group Your Sightseeing by Valley Corridor
• Corridor 1 — Kachura & Skardu Town: Visit Shangrila (Lower Kachura Lake), take a short walk to Upper Kachura Lake, explore Soq Valley, and watch sunset at Katpana Cold Desert or Kharpocho Fort.
• Corridor 2 — Shigar Valley: Cross the Indus River to visit Sarfaranga Cold Desert, Blind Lake, Amburiq wooden mosque, and historic Shigar Fort (Fong-Khar).
• Corridor 3 — Khaplu Valley: Follow the Shyok River east (approx. 2.5 to 3 hours from Skardu) to visit Manthoka Waterfall on the way, Chaqchan Mosque, and Khaplu Palace.
• Corridor 4 — Deosai National Park: Dedicate a full summer day with a 4x4 jeep to cross Sadpara Lake up to Deosai Plains, Kala Pani, Bara Pani, and Sheosar Lake.

3. Confirm Transport & Accommodation Early
During summer and October foliage weeks, reliable 4x4 jeeps and well-located family hotels in Skardu, Kachura, Shigar, and Khaplu book up quickly. Contact Baig Treks and Tours to arrange your complete itinerary before departure.`,
    imageUrl: skarduValleyImg,
    published: true,
    publishedDate: '2026',
    readTime: '7 min read',
    relatedTourSlugs: ['skardu-tour-packages', 'hunza-skardu-tour', 'naran-skardu-tour'],
    relatedDestinationSlugs: ['skardu', 'shigar', 'khaplu', 'deosai'],
    seoTitle: 'How to Plan a Skardu Trip | Routes, Itinerary & Tips | Baig Treks and Tours',
    seoDescription:
      'Step-by-step guide on how to plan a Skardu trip in Pakistan. Learn about road vs air routes, Kachura Lakes, Shigar, Khaplu, and Deosai Plains logistics.',
  },
  {
    id: 'guide-plan-hunza-trip',
    slug: 'how-to-plan-a-hunza-trip',
    title: 'How to Plan a Hunza Valley Trip: Central Hunza, Attabad Lake & Gojal Guide',
    category: 'Destination Guide',
    excerpt:
      'Everything you need to know to structure a smooth Hunza tour across Rakaposhi Viewpoint, Karimabad, Duikar, Attabad Lake, Passu, and Khunjerab Pass.',
    content: `Hunza Valley is one of the most rewarding and straightforward regions to explore in Northern Pakistan because its main sights lie sequentially along the Karakoram Highway (N-35). Here is how to structure your Hunza trip for maximum comfort.

1. Choose Your Entry Route
• Summer Route (June to October): Most overland groups travel from Islamabad via Balakot, Naran Kaghan, Lulusar Lake, and Babusar Top, joining the Karakoram Highway at Chilas before continuing past the Three Mountain Ranges Junction and Gilgit into Hunza.
• Year-Round Highway Route: When Babusar Top is closed in spring, late autumn, or winter, travelers follow the Hazara Motorway and Karakoram Highway through Besham, Dassu, and Chilas.
• Fly-In Option: Fly to Gilgit Airport and drive 1.5 to 2 hours past Rakaposhi Viewpoint directly into Central Hunza.

2. Split Your Stay Between Central Hunza and Upper Hunza (Gojal)
• Central Hunza (Karimabad & Duikar): Spend 2 to 3 nights in Karimabad or Duikar. Visit Baltit Fort, Altit Fort and Royal Garden, walk Karimabad’s stone bazaar street, and enjoy sunrise over Rakaposhi, Diran, and Ultar peaks from Eagle’s Nest (Duikar).
• Upper Hunza (Attabad Lake, Gulmit & Passu): Drive 40 minutes north through the Attabad tunnels to reach the turquoise waters of Attabad Lake. Continue into Gojal to walk near Borith Lake, cross Hussaini Suspension Bridge, photograph the iconic Passu Cathedral Cones, and take a day excursion through Khunjerab National Park to Khunjerab Pass (4,693 m).

Contact Baig Treks and Tours on WhatsApp (03155449778) to customize a private family, couple, or group Hunza tour package.`,
    imageUrl: attabadPassuImg,
    published: true,
    publishedDate: '2026',
    readTime: '6 min read',
    relatedTourSlugs: ['hunza-tour-packages', 'naran-hunza-tour', 'hunza-skardu-tour'],
    relatedDestinationSlugs: ['hunza', 'karimabad', 'attabad-lake', 'passu', 'khunjerab'],
    seoTitle: 'How to Plan a Hunza Trip | Karimabad, Attabad Lake & Passu Guide | Baig Treks and Tours',
    seoDescription:
      'Complete guide on how to plan a Hunza Valley trip. Learn about Naran/Babusar vs KKH routes, Karimabad forts, Attabad Lake, Passu Cones, and Khunjerab Pass.',
  },
  {
    id: 'guide-what-to-pack',
    slug: 'what-to-pack-for-northern-pakistan',
    title: 'What to Pack for Northern Pakistan: Mountain Travel Checklist',
    category: 'Preparation',
    excerpt:
      'Essential clothing layers, footwear, sun protection, documents, and practical electronics for road trips and trekking in Gilgit-Baltistan, Naran, and Kashmir.',
    content: `Mountain weather in Northern Pakistan can shift quickly as you gain elevation between river valleys (1,500 m in Gilgit) and high passes or plateaus (3,300 m at Fairy Meadows, 4,100 m at Deosai and Babusar Top, and 4,693 m at Khunjerab Pass). Packing smart layers keeps your group comfortable throughout the trip.

1. Layered Clothing (Even in Summer)
• Base Layer: Breathable cotton or moisture-wicking t-shirts for warm daytime drives in lower valleys.
• Mid Layer: A warm fleece jacket or wool sweater for cool mornings and evenings in Hunza, Skardu, Naran, and Arang Kel.
• Outer Layer: A windproof and water-resistant jacket or light down puffer for high-altitude stops like Babusar Top, Deosai Plains, and Khunjerab Pass.

2. Footwear
• Valley Sightseeing & Road Trips: Comfortable closed walking shoes or sneakers with good grip for fort stairs, rocky viewpoints, and suspension bridges.
• Trekking Routes (Fairy Meadows & Alpine Trails): Broken-in ankle-support trekking shoes or hiking boots, plus wool/cushioned socks.

3. Sun, Wind & Health Essentials
• High-altitude UV rays are strong even on cool days—pack polarized sunglasses, SPF 50+ sunscreen, lip balm, and a sun cap.
• Personal medication, basic motion-sickness tablets for winding mountain roads, and a reusable water bottle.

4. Documents, Cash & Connectivity
• Original CNIC for Pakistani travelers (or Passport and valid visa documents for international visitors) along with a few photocopies for routine checkposts.
• Sufficient cash in Pakistani Rupees (PKR), as ATMs are mainly limited to larger towns like Gilgit, Karimabad, Skardu, and Naran.
• A high-capacity power bank for long photography days along the Karakoram Highway.`,
    imageUrl: attabadPassuImg,
    published: true,
    publishedDate: '2026',
    readTime: '5 min read',
    relatedTourSlugs: ['hunza-tour-packages', 'skardu-tour-packages', 'fairy-meadows-trek-tour'],
    relatedDestinationSlugs: ['northern-areas', 'hunza', 'skardu', 'fairy-meadows', 'deosai'],
    seoTitle: 'What to Pack for Northern Pakistan & Gilgit-Baltistan | Baig Treks and Tours',
    seoDescription:
      'Complete packing checklist for Northern Pakistan tours to Hunza, Skardu, Naran Kaghan, Kashmir, Deosai, and Fairy Meadows across summer, autumn, and trekking seasons.',
  },
  {
    id: 'guide-northern-pakistan-master',
    slug: 'northern-pakistan-travel-guide',
    title: 'Northern Pakistan Travel Guide: Regions, Routes & How to Choose Your Tour',
    category: 'Regional Overview',
    excerpt:
      'An overview of Pakistan’s northern mountain regions—comparing Hunza, Skardu, Naran Kaghan, Kashmir, Fairy Meadows, and Deosai for first-time and returning travelers.',
    content: `Northern Pakistan encompasses several distinct mountain regions, each with its own road network, elevation profile, and best travel season. Understanding how these regions connect helps you select the right tour package for your family, honeymoon, or group.

1. Gilgit-Baltistan (Hunza, Skardu, Fairy Meadows, Deosai & Ghizer)
Gilgit-Baltistan is home to the Karakoram and Western Himalayas.
• Hunza Valley (Central & Upper Hunza): Best for paved highway comfort, heritage forts (Baltit & Altit), Attabad Lake, Passu Cones, and Khunjerab Pass. Ideal duration: 5–7 days.
• Skardu & Baltistan (Skardu, Shigar, Khaplu & Deosai): Best for alpine lakes (Kachura), high-altitude cold deserts, Balti palaces, and the 4,100 m Deosai plateau. Ideal duration: 5–7 days.
• Fairy Meadows (Diamer): Best for alpine trekking and cabin stays directly facing Nanga Parbat (8,126 m). Ideal duration: 4–5 days (or added onto a Hunza/Skardu route).

2. Kaghan Valley (Naran, Lake Saif-ul-Malook & Babusar Top)
Located in Khyber Pakhtunkhwa south of Gilgit-Baltistan, Naran Kaghan offers pine forests, Kunhar River views, Lake Saif-ul-Malook, and Lulusar Lake. In summer (June–October), Babusar Top (4,173 m) serves as the primary scenic shortcut connecting Islamabad to Gilgit, Hunza, and Skardu. Ideal standalone duration: 3–5 days.

3. Azad Kashmir (Neelum Valley, Keran, Sharda & Arang Kel)
Known for lush green Himalayan forests and wooden hilltop villages like Arang Kel, Neelum Valley is ideal for 3-to-5 day family and couple trips from Islamabad without crossing high 4,000-meter highway passes.

How to Book Your Northern Pakistan Tour
Baig Treks and Tours arranges customized private and group tours across all of these corridors. Contact our team directly on WhatsApp at 03155449778 or submit an online inquiry to plan your route.`,
    imageUrl: heroKarakoramImg,
    published: true,
    publishedDate: '2026',
    readTime: '7 min read',
    relatedTourSlugs: [
      'hunza-tour-packages',
      'skardu-tour-packages',
      'naran-kaghan-tour-packages',
      'kashmir-tour-packages',
      'hunza-skardu-tour',
    ],
    relatedDestinationSlugs: ['northern-areas', 'hunza', 'skardu', 'naran-kaghan', 'kashmir', 'fairy-meadows'],
    seoTitle: 'Northern Pakistan Travel Guide | Hunza, Skardu, Naran & Kashmir | Baig Treks and Tours',
    seoDescription:
      'Comprehensive Northern Pakistan travel guide by Baig Treks and Tours. Compare Hunza, Skardu, Naran Kaghan, Kashmir, Fairy Meadows, and Deosai routes and seasons.',
  },
];

export const INITIAL_GALLERY: GalleryImageItem[] = [
  {
    id: 'gal-1',
    imageUrl: heroKarakoramImg,
    caption: 'Golden hour over Hunza Valley and the winding Karakoram Highway',
    altText: 'Wide-angle view of Hunza Valley and snow-capped Karakoram mountains at golden hour',
    category: 'Hunza',
    destination: 'Hunza',
    featured: true,
  },
  {
    id: 'gal-2',
    imageUrl: attabadPassuImg,
    caption: 'Turquoise glacial waters of Attabad Lake with Passu Cones on the horizon',
    altText: 'Turquoise waters of Attabad Lake with jagged Passu Cones peaks in Upper Hunza',
    category: 'Attabad Lake',
    destination: 'Attabad Lake',
    featured: true,
  },
  {
    id: 'gal-3',
    imageUrl: skarduValleyImg,
    caption: 'Twilight reflections and desert dunes in Skardu Valley, Baltistan',
    altText: 'Skardu Valley cold desert dunes and snow-dusted Karakoram mountains reflected in river',
    category: 'Skardu',
    destination: 'Skardu',
    featured: true,
  },
  {
    id: 'gal-4',
    imageUrl: fairyMeadowsImg,
    caption: 'Sunrise over the Raikot face of Nanga Parbat from Fairy Meadows',
    altText: 'Green alpine pasture of Fairy Meadows framed by pine trees and snow-covered Nanga Parbat',
    category: 'Trekking',
    destination: 'Fairy Meadows',
    featured: true,
  },
  {
    id: 'gal-5',
    imageUrl: deosaiPlainsImg,
    caption: 'High-altitude alpine streams winding across Deosai Plains',
    altText: 'Crystal clear mountain stream and wildflowers across the high-altitude plateau of Deosai',
    category: 'Mountains',
    destination: 'Deosai',
    featured: true,
  },
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How many days are needed for a Hunza or Skardu tour?',
    answer:
      'A standalone Hunza Valley tour or Skardu tour typically requires 5 to 7 days. If you want to combine both Hunza and Skardu in one overland trip, we recommend 8 to 12 days. Shorter trips to Naran Kaghan or Kashmir (Neelum Valley) can be completed in 3 to 5 days.',
    category: 'Trip Planning',
  },
  {
    id: 'faq-2',
    question: 'Are these tours suitable for families, children, and seniors?',
    answer:
      'Yes. Valley road journeys to Hunza, Skardu, Shigar, and Naran Kaghan use paved highways and can be tailored with comfortable pacing for families, children, and seniors. High-altitude trekking routes such as Fairy Meadows require moderate walking fitness.',
    category: 'Family Travel',
  },
  {
    id: 'faq-3',
    question: 'Where do Baig Treks and Tours trips start from?',
    answer:
      'Departure points are flexible and customized to your group. We organize overland departures from Islamabad (and other major cities upon request) as well as airport pickup and ground arrangements in Gilgit and Skardu for fly-in travelers.',
    category: 'Logistics',
  },
  {
    id: 'faq-4',
    question: 'What transport and hotels are included in a tour package?',
    answer:
      'Transport (private cars, SUVs, vans/coasters, and local 4x4 jeeps for Deosai, Fairy Meadows, or Saif-ul-Malook) and accommodation tiers are customized according to your group size, budget, and preferred valleys. All inclusions are confirmed with you before booking.',
    category: 'Inclusions',
  },
  {
    id: 'faq-5',
    question: 'What is the best season to visit Northern Pakistan?',
    answer:
      'Spring (late March to April) is famous for blossom season in Hunza. Summer (May to September) is the best season for Naran Kaghan, Babusar Top, Deosai Plains, Kashmir, and family holidays. Autumn (October to early November) offers golden foliage across Hunza, Skardu, Shigar, and Khaplu.',
    category: 'Seasons',
  },
  {
    id: 'faq-6',
    question: 'Can I customize my tour dates, destinations, and itinerary?',
    answer:
      'Yes. Every private, family, honeymoon, or group tour can be customized around your travel dates, preferred destinations (Hunza, Skardu, Naran Kaghan, Kashmir, Fairy Meadows, or combined routes), and accommodation preferences.',
    category: 'Customization',
  },
  {
    id: 'faq-7',
    question: 'How do I book a tour with Baig Treks and Tours?',
    answer:
      'Submit a trip inquiry through our website or message us directly on WhatsApp at 03155449778 to verify dates, itinerary details, and pricing. Once confirmed, reservation payments can be made via our official JazzCash account (03155449778 — Account Name: ESSA ALI).',
    category: 'Booking',
  },
  {
    id: 'faq-8',
    question: 'What should travelers pack for Northern Areas of Pakistan?',
    answer:
      'Even in summer, pack layered clothing including breathable daywear, a warm fleece, and a windproof jacket for cool evenings and high mountain passes, along with comfortable walking shoes, sun protection, a power bank, and your original CNIC or passport.',
    category: 'Preparation',
  },
];
