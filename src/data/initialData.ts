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
  groupSize?: string;
  difficulty?: string;
  bestSeason?: string;
  shortDescription: string;
  overview: string;
  badge: string; // Empty unless explicitly assigned by admin
  featured: boolean;
  bookingStatus: 'Available' | 'Limited Availability' | 'Sold Out' | 'Inquiry Only';
  pricePerPerson: number; // 0 means not yet configured -> show "Contact us for current pricing."
  couplePrice: number;
  childPrice: number;
  groupPriceNote: string;
  imageUrl: string;
  itinerary: ItineraryDayItem[];
  inclusions: string[];
  exclusions: string[];
  transportation: string;
  accommodation: string;
}

export interface DestinationItem {
  id: string;
  slug: string;
  name: string;
  region: string;
  elevation?: string;
  coordinates?: { x: number; y: number }; // Stylized SVG map coordinates (0-100)
  shortDescription: string;
  description: string;
  attractions: string[];
  bestSeason: string;
  idealFor: string[];
  imageUrl: string;
  isConfirmedTourOffering?: boolean;
  activeTourOffering?: boolean;
}

export interface ExperienceCategoryItem {
  id: string;
  title: string;
  subtitle: string;
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
  published: boolean;
  readTime: string;
  seoTitle: string;
  seoDescription: string;
}

export interface GalleryImageItem {
  id: string;
  imageUrl: string;
  caption: string;
  altText: string;
  category: string;
  destination: string;
  featured: boolean;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  reviewText: string;
  photoUrl: string;
  verified: boolean;
  source: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

/**
 * Initial Tour Catalog
 * Strictly adheres to Section 58 Non-Fabrication Rule:
 * - No fabricated prices (pricePerPerson = 0 -> renders "Contact us for current pricing.")
 * - No fabricated itineraries (itinerary = [] -> renders "Detailed itinerary coming soon — contact Baig Trecks & Tours for the latest itinerary.")
 * - No fabricated hotel names or vehicle guarantees.
 * - No automatic "BEST SELLER" badge unless assigned by admin.
 */
export const INITIAL_TOURS: TourItem[] = [
  {
    id: 'hunza-tour',
    slug: 'hunza-tour',
    title: 'Hunza Valley & Upper Karakoram Journey',
    destination: 'Hunza',
    duration: 'Flexible Duration (Configurable)',
    durationCategory: '4-6 Days',
    tourType: 'Family Holidays',
    startingLocation: 'Contact Baig Trecks & Tours for departure cities',
    endingLocation: 'Contact Baig Trecks & Tours for return point',
    groupSize: 'Private or Group (Upon Inquiry)',
    difficulty: 'Easy to Moderate Scenic Road Journey',
    bestSeason: 'Spring Blossom, Summer & Autumn Foliage',
    shortDescription:
      'Explore Karimabad, Attabad Lake, Passu Cones, and the high mountain passes of Upper Hunza with customized travel planning by Baig Trecks & Tours.',
    overview:
      'Journey along the legendary Karakoram Highway into the heart of Hunza Valley. This customizable itinerary is designed for travelers seeking dramatic mountain vistas, turquoise glacial waters at Attabad Lake, the jagged cathedral peaks of Passu, and authentic local hospitality across Gilgit-Baltistan.',
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
    transportation: '',
    accommodation: '',
  },
  {
    id: 'skardu-tour',
    slug: 'skardu-tour',
    title: 'Skardu Valley, Shigar, Khaplu & Deosai Expedition',
    destination: 'Skardu',
    duration: 'Flexible Duration (Configurable)',
    durationCategory: '7-10 Days',
    tourType: 'Adventure Tours',
    startingLocation: 'Contact Baig Trecks & Tours for departure cities',
    endingLocation: 'Contact Baig Trecks & Tours for return point',
    groupSize: 'Private or Group (Upon Inquiry)',
    difficulty: 'Moderate Mountain Travel',
    bestSeason: 'Summer & Autumn',
    shortDescription:
      'Experience the high-altitude desert of Skardu, historic valleys of Shigar and Khaplu, and the vast alpine plains of Deosai in Baltistan.',
    overview:
      'Discover the majestic landscapes of Baltistan. From the dramatic confluence of the Indus River and high-altitude cold desert sand dunes to historic mountain valleys in Shigar and Khaplu and the seasonal alpine expanse of Deosai, Baig Trecks & Tours tailors every detail to your group.',
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
    transportation: '',
    accommodation: '',
  },
  {
    id: 'hunza-skardu-tour',
    slug: 'hunza-skardu-tour',
    title: 'Grand Gilgit-Baltistan Circuit: Hunza & Skardu',
    destination: 'Hunza',
    duration: 'Flexible Duration (Configurable)',
    durationCategory: '10+ Days',
    tourType: 'Road Trips',
    startingLocation: 'Contact Baig Trecks & Tours for departure cities',
    endingLocation: 'Contact Baig Trecks & Tours for return point',
    groupSize: 'Private, Couple, or Group (Upon Inquiry)',
    difficulty: 'Moderate Overland Expedition',
    bestSeason: 'May to November',
    shortDescription:
      'Combine the iconic valleys of Hunza and Skardu in one comprehensive overland journey through the Karakoram and western Himalayas.',
    overview:
      'Our signature multi-valley route connects Gilgit, Karimabad, Attabad Lake, and Passu with Skardu, Shigar, and Khaplu. Ideal for families, couples, and road-trip enthusiasts looking to experience the full breadth of Northern Pakistan in a single coordinated itinerary.',
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
    transportation: '',
    accommodation: '',
  },
  {
    id: 'fairy-meadows-trek-tour',
    slug: 'fairy-meadows-trek-tour',
    title: 'Fairy Meadows & Nanga Parbat Viewpoint Trek',
    destination: 'Fairy Meadows',
    duration: 'Flexible Duration (Configurable)',
    durationCategory: '4-6 Days',
    tourType: 'Trekking',
    startingLocation: 'Contact Baig Trecks & Tours for departure cities',
    endingLocation: 'Contact Baig Trecks & Tours for return point',
    groupSize: 'Small Group or Private Trek',
    difficulty: 'Moderate Alpine Trekking',
    bestSeason: 'May to October',
    shortDescription:
      'Traverse mountain jeep tracks and pine-scented alpine trails to stand beneath the towering Raikot Face of Nanga Parbat.',
    overview:
      'Designed for nature lovers and mountain trekkers, this journey takes you from the Karakoram Highway up the Raikot mountain track and along scenic forest trails to the lush alpine pastures of Fairy Meadows facing Nanga Parbat.',
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
    transportation: '',
    accommodation: '',
  },
];

export const INITIAL_DESTINATIONS: DestinationItem[] = [
  {
    id: 'hunza',
    slug: 'hunza',
    name: 'Hunza Valley',
    region: 'Gilgit-Baltistan',
    elevation: '2,438 m',
    coordinates: { x: 48, y: 24 },
    shortDescription: 'Terraced orchards, ancient forts, and panoramic views of Rakaposhi and Ultar Sar.',
    description:
      'Situated along the Karakoram Highway, Hunza Valley is celebrated for its dramatic mountain amphitheater, historic settlements, and welcoming mountain communities.',
    attractions: ['Baltit Fort', 'Altit Fort', 'Eagle’s Nest Viewpoint', 'Karimabad Bazaar'],
    bestSeason: 'April to November',
    idealFor: ['Families', 'Couples', 'Photographers', 'Cultural Travelers'],
    imageUrl: heroKarakoramImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
  },
  {
    id: 'skardu',
    slug: 'skardu',
    name: 'Skardu',
    region: 'Baltistan Division',
    elevation: '2,228 m',
    coordinates: { x: 68, y: 58 },
    shortDescription: 'Gateway to the high Karakoram peaks, alpine lakes, and cold desert landscapes.',
    description:
      'Skardu sits at the wide confluence of the Indus and Shigar rivers, serving as the cultural and expedition hub of Baltistan.',
    attractions: ['Shangrila & Lower Kachura', 'Upper Kachura Lake', 'Katpana Cold Desert', 'Kharpocho Fort'],
    bestSeason: 'May to October',
    idealFor: ['Families', 'Adventure Travelers', 'Road Trippers'],
    imageUrl: skarduValleyImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
  },
  {
    id: 'gilgit',
    slug: 'gilgit',
    name: 'Gilgit',
    region: 'Gilgit Division',
    elevation: '1,500 m',
    coordinates: { x: 38, y: 42 },
    shortDescription: 'Historic crossroads of the Silk Route and administrative heart of Gilgit-Baltistan.',
    description:
      'Surrounded by rugged peaks where the Gilgit and Hunza rivers meet the Indus, Gilgit is the central hub connecting all major northern valleys.',
    attractions: ['Kargah Buddha', 'Gilgit River Suspension Bridge', 'Three Mountain Ranges Junction'],
    bestSeason: 'Year-Round',
    idealFor: ['Road Trippers', 'Cultural Explorers', 'Families'],
    imageUrl: heroKarakoramImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
  },
  {
    id: 'attabad-lake',
    slug: 'attabad-lake',
    name: 'Attabad Lake',
    region: 'Upper Hunza (Gojal)',
    elevation: '2,559 m',
    coordinates: { x: 53, y: 20 },
    shortDescription: 'Brilliant turquoise glacial waters framed by sheer Karakoram rock walls.',
    description:
      'One of Northern Pakistan’s most striking natural landmarks, Attabad Lake offers serene boat rides and views along the tunnels of the Karakoram Highway.',
    attractions: ['Turquoise Lake Boating', 'Jet Skiing', 'KKH Attabad Tunnels', 'Lakeside Cafes'],
    bestSeason: 'April to November',
    idealFor: ['Couples', 'Families', 'Sightseers', 'Photographers'],
    imageUrl: attabadPassuImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
  },
  {
    id: 'passu',
    slug: 'passu',
    name: 'Passu',
    region: 'Gojal, Upper Hunza',
    elevation: '2,480 m',
    coordinates: { x: 56, y: 15 },
    shortDescription: 'Home to the iconic jagged Passu Cones (Tupopdan) and white Passu Glacier.',
    description:
      'Passu is an unforgettable stop along the Upper Hunza riverbed, dominated by cathedral-like granite spires that glow gold at sunrise and sunset.',
    attractions: ['Passu Cathedral Cones', 'Hussaini Suspension Bridge', 'Passu Glacier Viewpoint', 'Borith Lake'],
    bestSeason: 'April to November',
    idealFor: ['Photographers', 'Road Trippers', 'Nature Lovers'],
    imageUrl: attabadPassuImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
  },
  {
    id: 'khunjerab',
    slug: 'khunjerab',
    name: 'Khunjerab Pass',
    region: 'Upper Gojal',
    elevation: '4,693 m',
    coordinates: { x: 60, y: 8 },
    shortDescription: 'High-altitude paved mountain pass at the northern frontier of Pakistan.',
    description:
      'Surrounded by snow-dusted alpine meadows and Khunjerab National Park habitats, the pass marks the northern culmination of the Karakoram Highway.',
    attractions: ['Pak-China Border Monument', 'Khunjerab National Park', 'Marco Polo Sheep & Ibex Habitat'],
    bestSeason: 'May to November',
    idealFor: ['Road Trippers', 'Adventure Travelers', 'Families'],
    imageUrl: heroKarakoramImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
  },
  {
    id: 'karimabad',
    slug: 'karimabad',
    name: 'Karimabad',
    region: 'Central Hunza',
    elevation: '2,500 m',
    coordinates: { x: 46, y: 27 },
    shortDescription: 'Cultural heart of Hunza overlooking Rakaposhi, Diran, and Ultar peaks.',
    description:
      'Karimabad blends centuries-old Baltit and Altit architectural heritage with vibrant bazaars, cafes, and panoramic viewpoints.',
    attractions: ['Baltit Heritage Fort', 'Karimabad Stone Street', 'Ultar Meadow View', 'Duikar Sunrise'],
    bestSeason: 'March to November',
    idealFor: ['Families', 'Honeymooners', 'History & Culture Enthusiasts'],
    imageUrl: heroKarakoramImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
  },
  {
    id: 'shigar',
    slug: 'shigar',
    name: 'Shigar Valley',
    region: 'Baltistan',
    elevation: '2,260 m',
    coordinates: { x: 72, y: 48 },
    shortDescription: 'Orchard-filled valley along the Shigar River leading toward the high Karakoram.',
    description:
      'Known for its historic wooden and stone architecture, apricot groves, and dramatic riverbeds, Shigar offers a tranquil cultural experience near Skardu.',
    attractions: ['Shigar Fort (Fong-Khar)', 'Amburiq Mosque', 'Sarfaranga Cold Desert', 'Blind Lake'],
    bestSeason: 'May to October',
    idealFor: ['Families', 'Heritage Travelers', 'Couples'],
    imageUrl: skarduValleyImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
  },
  {
    id: 'khaplu',
    slug: 'khaplu',
    name: 'Khaplu Valley',
    region: 'Ghanche District',
    elevation: '2,600 m',
    coordinates: { x: 84, y: 56 },
    shortDescription: 'Scenic eastern Baltistan valley along the Shyok River with Masherbrum views.',
    description:
      'Khaplu is renowned for its peaceful villages, Chaqchan heritage, and winding mountain roads framed by towering granite peaks.',
    attractions: ['Khaplu Palace (Yabgo Khar)', 'Chaqchan Mosque', 'Saling Fish Farm', 'Machulo Viewpoint'],
    bestSeason: 'May to October',
    idealFor: ['Cultural Travelers', 'Families', 'Photographers'],
    imageUrl: deosaiPlainsImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
  },
  {
    id: 'deosai',
    slug: 'deosai',
    name: 'Deosai Plains',
    region: 'Skardu / Astore Border',
    elevation: '4,114 m',
    coordinates: { x: 58, y: 68 },
    shortDescription: 'Legendary high-altitude alpine plateau carpeted with summer wildflowers and streams.',
    description:
      'Spanning thousands of square kilometers between Skardu and Astore, Deosai offers boundless horizons, Sheosar Lake, and crisp alpine air during summer months.',
    attractions: ['Sheosar Lake', 'Bara Pani Crossing', 'Kala Pani', 'Himalayan Brown Bear Sanctuary'],
    bestSeason: 'June to September',
    idealFor: ['Adventure Travelers', 'Nature Lovers', '4x4 Expeditions'],
    imageUrl: deosaiPlainsImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
  },
  {
    id: 'astore',
    slug: 'astore',
    name: 'Astore Valley',
    region: 'Diamer Division',
    elevation: '2,600 m',
    coordinates: { x: 46, y: 66 },
    shortDescription: 'Lush green side valleys, Rama Meadow, and eastern approaches to Nanga Parbat.',
    description:
      'Astore features pine forests, glacial lakes, and dramatic mountain roads connecting the Karakoram Highway to Deosai.',
    attractions: ['Rama Meadow & Rama Lake', 'Minimerg & Rainbow Lake', 'Rupal Face Viewpoint'],
    bestSeason: 'May to October',
    idealFor: ['Nature Lovers', 'Trekkers', 'Jeep Safari Enthusiasts'],
    imageUrl: fairyMeadowsImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
  },
  {
    id: 'naltar',
    slug: 'naltar',
    name: 'Naltar Valley',
    region: 'Hunza-Nagar / Gilgit Approach',
    elevation: '2,900 m',
    coordinates: { x: 39, y: 31 },
    shortDescription: 'Forested alpine valley famous for multi-colored glacial lakes and spruce slopes.',
    description:
      'Accessible via mountain track from Nomal near Gilgit, Naltar captivates travelers with dense pine forests and jewel-toned alpine lakes.',
    attractions: ['Satrangi (Seven-Color) Lake', 'Blue Lake (Pari Lake)', 'Pine & Spruce Forests'],
    bestSeason: 'June to October & Winter Ski Season',
    idealFor: ['Adventure Travelers', 'Photographers', 'Day Trippers'],
    imageUrl: fairyMeadowsImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
  },
  {
    id: 'fairy-meadows',
    slug: 'fairy-meadows',
    name: 'Fairy Meadows',
    region: 'Diamer District',
    elevation: '3,300 m',
    coordinates: { x: 34, y: 58 },
    shortDescription: 'Iconic alpine grassland directly facing the snow wall of Nanga Parbat.',
    description:
      'Reached by a thrilling mountain jeep track and scenic forest trail, Fairy Meadows offers unforgettable stargazing and views of the ninth-highest mountain on Earth.',
    attractions: ['Raikot Jeep Track', 'Beyal Camp Trail', 'Nanga Parbat Base Camp Viewpoint', 'Reflection Pond'],
    bestSeason: 'May to October',
    idealFor: ['Trekkers', 'Campers', 'Mountain Photographers'],
    imageUrl: fairyMeadowsImg,
    isConfirmedTourOffering: true,
    activeTourOffering: true,
  },
  {
    id: 'ghizer',
    slug: 'ghizer',
    name: 'Ghizer Valley',
    region: 'Western Gilgit-Baltistan',
    elevation: '2,100 m',
    coordinates: { x: 22, y: 34 },
    shortDescription: 'Crystal-clear rivers, Phander Lake, and serene autumn foliage toward Shandur.',
    description:
      'Stretching west from Gilgit, Ghizer is a peaceful corridor of turquoise rivers, trout streams, and welcoming mountain villages.',
    attractions: ['Phander Lake', 'Khalti Lake', 'Gupis Valley', 'Shandur Pass Approach'],
    bestSeason: 'April to November',
    idealFor: ['Road Trippers', 'Anglers', 'Autumn Foliage Seekers'],
    imageUrl: attabadPassuImg,
    isConfirmedTourOffering: false,
    activeTourOffering: true,
  },
];

export const INITIAL_EXPERIENCES: ExperienceCategoryItem[] = [
  {
    id: 'exp-family',
    title: 'FAMILY HOLIDAYS',
    subtitle: 'Comfortable Pacing & Scenic Valleys',
    description:
      'Thoughtfully paced journeys through Hunza and Skardu designed for multi-generational families seeking comfort, scenic stops, and smooth logistics.',
    tourTypeFilter: 'Family Holidays',
    imageUrl: heroKarakoramImg,
  },
  {
    id: 'exp-honeymoon',
    title: 'HONEYMOON TOURS',
    subtitle: 'Private Vistas & Serene Retreats',
    description:
      'Private itineraries featuring lakeside views at Attabad, quiet valley evenings, and flexible daily schedules tailored for couples.',
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
      'Guided walking and trekking routes to Fairy Meadows, Nanga Parbat viewpoints, and scenic glacial valleys.',
    tourTypeFilter: 'Trekking',
    imageUrl: fairyMeadowsImg,
  },
  {
    id: 'exp-cultural',
    title: 'CULTURAL TOURS',
    subtitle: 'Heritage Forts, Villages & Local Cuisine',
    description:
      'Connect with the living heritage, architecture, music, and traditional flavors of Hunza, Shigar, Khaplu, and Gilgit.',
    tourTypeFilter: 'Cultural Trips',
    imageUrl: heroKarakoramImg,
  },
  {
    id: 'exp-roadtrips',
    title: 'ROAD TRIPS',
    subtitle: 'The Legendary Karakoram Highway',
    description:
      'Epic overland drives along river gorges, suspension bridges, and dramatic mountain passes from Gilgit to Khunjerab and Skardu.',
    tourTypeFilter: 'Road Trips',
    imageUrl: attabadPassuImg,
  },
  {
    id: 'exp-private',
    title: 'PRIVATE TOURS',
    subtitle: 'Dedicated Vehicle & Personal Schedule',
    description:
      'Travel exclusively with your own group and dedicated itinerary adjustments across any destination in Gilgit-Baltistan.',
    tourTypeFilter: 'Private Tours',
    imageUrl: deosaiPlainsImg,
  },
  {
    id: 'exp-custom',
    title: 'CUSTOM TOURS',
    subtitle: 'Built Around Your Dates & Interests',
    description:
      'Tell Baig Trecks & Tours your preferred valleys, travel dates, and group size, and we will craft a bespoke Northern Pakistan itinerary.',
    tourTypeFilter: 'Custom Tours',
    imageUrl: skarduValleyImg,
  },
];

export const INITIAL_BLOG_POSTS: BlogPostItem[] = [
  {
    id: 'guide-best-time-hunza',
    slug: 'best-time-to-visit-hunza-valley',
    title: 'Best Time to Visit Hunza Valley: Seasons, Weather & Landscape Guide',
    category: 'Seasonal Planning',
    excerpt:
      'From April apricot blossoms and lush summer pastures to the golden poplar trees of October, understand how each season transforms Hunza Valley.',
    content: `Hunza Valley transforms dramatically with each season of the year. Choosing the right window for your journey depends on whether you prefer mild summer temperatures, spring orchard blossoms, or crisp autumn foliage.

1. Spring Blossom (Late March to April)
Across Central and Lower Hunza, apricot, cherry, almond, and apple trees bloom against a backdrop of snow-covered peaks. Daytime temperatures are pleasantly cool while evenings require warm layers.

2. Summer High Season (May to August)
Summer brings long daylight hours, accessible high-altitude passes toward Khunjerab, and vibrant greenery across Karimabad, Gojal, and Passu. It is ideal for families and road trips escaping warmer plains.

3. Autumn Foliage (October to Early November)
In autumn, poplar and orchard trees along the Hunza River turn brilliant shades of gold, amber, and crimson. Skies are often crystal clear, offering some of the sharpest photography conditions of the year.

Contact Baig Trecks & Tours on WhatsApp to check current road and weather conditions for your preferred travel dates.`,
    imageUrl: heroKarakoramImg,
    published: true,
    readTime: '5 min read',
    seoTitle: 'Best Time to Visit Hunza Valley — Seasonal Travel Guide | Baig Trecks & Tours',
    seoDescription:
      'Plan your trip to Hunza Valley with our seasonal guide covering spring blossom, summer road trips, and autumn foliage in Gilgit-Baltistan.',
  },
  {
    id: 'guide-top-places-skardu',
    slug: 'top-places-to-visit-in-skardu',
    title: 'Top Places to Visit in Skardu, Shigar, Khaplu & Deosai',
    category: 'Destinations',
    excerpt:
      'A practical guide to Baltistan’s signature valleys, alpine lakes, cold deserts, and high-altitude plains.',
    content: `Skardu and the wider Baltistan region offer some of the most diverse terrain in the Karakoram. When planning your itinerary with Baig Trecks & Tours, consider how many days you want to dedicate to each valley:

• Skardu Valley & Lakes: Explore Upper Kachura Lake, Lower Kachura, and the striking cold desert sand dunes overlooking the Indus River valley.
• Shigar Valley: Just across the Indus, Shigar welcomes travelers with serene orchards, historic architecture, and views toward the gateways of the high Karakoram.
• Khaplu Valley: Follow the Shyok River east to Ghanche district to experience quiet mountain villages and panoramic viewpoints.
• Deosai Plains: During the summer window when snow clears, the high-altitude plateau of Deosai opens up between Skardu and Astore, featuring Sheosar Lake and endless alpine horizons.

Reach out to Baig Trecks & Tours for current route accessibility and customized Baltistan itineraries.`,
    imageUrl: skarduValleyImg,
    published: true,
    readTime: '6 min read',
    seoTitle: 'Top Places to Visit in Skardu & Baltistan | Baig Trecks & Tours',
    seoDescription:
      'Explore Skardu, Shigar, Khaplu, Kachura Lakes, and Deosai Plains with Baig Trecks & Tours.',
  },
  {
    id: 'guide-what-to-pack',
    slug: 'what-to-pack-for-northern-pakistan',
    title: 'What to Pack for Northern Pakistan: Mountain Travel Checklist',
    category: 'Preparation',
    excerpt:
      'Essential layering, footwear, sun protection, and practical electronics for road trips and trekking in Gilgit-Baltistan.',
    content: `Mountain weather in Gilgit-Baltistan can shift quickly as you gain elevation between river valleys (1,500m) and high passes or plateaus (3,500m–4,600m). Packing smart layers keeps you comfortable throughout your journey.

• Layered Clothing: Even in summer, pack a breathable base layer, a warm fleece or mid-layer, and a windproof/water-resistant outer jacket for evenings and high-altitude stops like Deosai or Khunjerab.
• Footwear: Comfortable closed walking shoes with good grip for sightseeing, or broken-in ankle-support trekking boots if visiting Fairy Meadows or alpine trails.
• Sun & Wind Protection: High-altitude sunlight is strong. Bring polarized sunglasses, SPF lip balm, sunscreen, and a hat.
• Power & Connectivity: Carry a reliable power bank for long scenic drives along the Karakoram Highway, as well as your original CNIC (or Passport/visa documents for international guests).`,
    imageUrl: attabadPassuImg,
    published: true,
    readTime: '4 min read',
    seoTitle: 'What to Pack for Northern Pakistan & Gilgit-Baltistan | Baig Trecks & Tours',
    seoDescription:
      'Complete packing guide for summer, autumn, and trekking trips to Hunza, Skardu, and Fairy Meadows.',
  },
  {
    id: 'guide-hunza-vs-skardu',
    slug: 'hunza-vs-skardu-which-to-choose',
    title: 'Hunza vs Skardu: How to Choose the Right Journey for Your Group',
    category: 'Trip Planning',
    excerpt:
      'Comparing road accessibility, scenery, cultural atmosphere, and duration requirements between Hunza Valley and Skardu.',
    content: `One of the most common questions travelers ask is whether to visit Hunza, Skardu, or combine both in one grand circuit.

• Choose Hunza Valley if: You want paved highway travel right through the heart of the valley, iconic viewpoints over Rakaposhi and Passu Cones, boat rides on Attabad Lake, and relaxed cafe and bazaar strolls in Karimabad.
• Choose Skardu & Baltistan if: You are drawn to vast dramatic scale—wide river valleys, high-altitude cold deserts, the alpine wilderness of Deosai, and the historic tranquility of Shigar and Khaplu.
• Combine Both if: You have 8 to 12+ days available and want to experience the complete diversity of Gilgit-Baltistan in a single trip.

Contact Baig Trecks & Tours on WhatsApp to discuss your available days and group preferences.`,
    imageUrl: deosaiPlainsImg,
    published: true,
    readTime: '5 min read',
    seoTitle: 'Hunza vs Skardu Travel Comparison | Baig Trecks & Tours',
    seoDescription:
      'Compare Hunza Valley and Skardu for family holidays, honeymoons, and road trips in Northern Pakistan.',
  },
];

export const INITIAL_GALLERY: GalleryImageItem[] = [
  {
    id: 'gal-1',
    imageUrl: heroKarakoramImg,
    caption: 'Golden hour over Hunza Valley and the winding Karakoram Highway (Illustrative regional visual — replaceable in Admin)',
    altText: 'Wide-angle view of Hunza Valley and snow-capped Karakoram mountains at golden hour',
    category: 'Hunza',
    destination: 'Hunza',
    featured: true,
  },
  {
    id: 'gal-2',
    imageUrl: attabadPassuImg,
    caption: 'Turquoise glacial waters of Attabad Lake with Passu Cones on the horizon (Illustrative regional visual — replaceable in Admin)',
    altText: 'Turquoise waters of Attabad Lake with jagged Passu Cones peaks in Upper Hunza',
    category: 'Attabad Lake',
    destination: 'Attabad Lake',
    featured: true,
  },
  {
    id: 'gal-3',
    imageUrl: skarduValleyImg,
    caption: 'Twilight reflections and desert dunes in Skardu Valley, Baltistan (Illustrative regional visual — replaceable in Admin)',
    altText: 'Skardu Valley cold desert dunes and snow-dusted Karakoram mountains reflected in river',
    category: 'Skardu',
    destination: 'Skardu',
    featured: true,
  },
  {
    id: 'gal-4',
    imageUrl: fairyMeadowsImg,
    caption: 'Sunrise over the Raikot face of Nanga Parbat from Fairy Meadows (Illustrative regional visual — replaceable in Admin)',
    altText: 'Green alpine pasture of Fairy Meadows framed by pine trees and snow-covered Nanga Parbat',
    category: 'Trekking',
    destination: 'Fairy Meadows',
    featured: true,
  },
  {
    id: 'gal-5',
    imageUrl: deosaiPlainsImg,
    caption: 'High-altitude alpine streams winding across Deosai Plains (Illustrative regional visual — replaceable in Admin)',
    altText: 'Crystal clear mountain stream and wildflowers across the high-altitude plateau of Deosai',
    category: 'Mountains',
    destination: 'Deosai',
    featured: true,
  },
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Are these tours suitable for families and children?',
    answer:
      'Family suitability depends on the specific route and pace. Valley road journeys to Hunza and Skardu can be tailored with comfortable stops for families and children, while high-altitude trekking routes require higher physical readiness. Contact Baig Trecks & Tours for current information on a specific tour.',
    category: 'General',
  },
  {
    id: 'faq-2',
    question: 'What is the cancellation and refund policy?',
    answer:
      'Contact Baig Trecks & Tours for current information regarding cancellation terms and refund policies prior to confirming your reservation.',
    category: 'Policies',
  },
  {
    id: 'faq-3',
    question: 'What should I pack for Northern Pakistan?',
    answer:
      'For Summer & Family Travel: light breathable daywear plus a warm fleece and windproof jacket for cool evenings and high passes. For Winter: thermal base layers, heavy down jacket, gloves, and insulated footwear. For Trekking & Mountain Travel: broken-in trekking shoes, rain shell, sun protection, daypack, and personal basic first-aid items.',
    category: 'Preparation',
  },
  {
    id: 'faq-4',
    question: 'Is mobile network available in Gilgit-Baltistan?',
    answer:
      'Mobile network coverage varies by valley and provider. SCOM provides the widest coverage across Gilgit, Hunza, and Skardu towns, while remote mountain stretches, high passes, and trekking zones may have limited or no signal.',
    category: 'Connectivity',
  },
  {
    id: 'faq-5',
    question: 'Is internet available during the trip?',
    answer:
      'Internet connectivity varies by location. Most towns in Gilgit, Karimabad, and Skardu offer mobile data or accommodation Wi-Fi, though speeds and reliability depend on weather and local infrastructure.',
    category: 'Connectivity',
  },
  {
    id: 'faq-6',
    question: 'What happens if weather changes during the journey?',
    answer:
      'Mountain travel in Gilgit-Baltistan is subject to natural weather and road conditions. If weather or road maintenance affects a route, itineraries may be adjusted on the ground prioritizing traveler safety.',
    category: 'Safety & Logistics',
  },
  {
    id: 'faq-7',
    question: 'Are airport transfers available?',
    answer:
      'Airport pickup and drop-off (for Gilgit, Skardu, or Islamabad departures) are configurable per tour package. Contact Baig Trecks & Tours to include airport transfers in your itinerary.',
    category: 'Logistics',
  },
  {
    id: 'faq-8',
    question: 'Can I customize my tour dates and destinations?',
    answer:
      'Yes. You can submit a custom tour inquiry or message us directly on WhatsApp with your preferred dates, group size, and destinations.',
    category: 'Customization',
  },
];
