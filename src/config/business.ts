export interface BusinessConfig {
  name: string;
  phone: string;
  phoneInternational: string;
  whatsapp: string;
  whatsappUrl: string;
  email: string;
  signupNotificationEmail: string;
  jazzcashNumber: string;
  jazzcashName: string;
  instagram: {
    handle: string;
    url: string;
  }[];
  locationLabel: string;
  tagline: string;
  heroHeadline: string;
  heroDescription: string;
  address: string;
  businessHours: string;
  cancellationPolicy: string;
  refundPolicy: string;
  bookingPolicy: string;
  paymentInstructions: string;
  ctaText?: string;
  footerInfo?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export const defaultBusinessConfig: BusinessConfig = {
  name: 'Baig Treks & Tours',
  phone: '03155449778',
  phoneInternational: '+923155449778',
  whatsapp: '923155449778',
  whatsappUrl: 'https://wa.me/923155449778',
  email: 'baigbaltee37@gmail.com',
  signupNotificationEmail: 'skardubhai1@gmail.com',
  jazzcashNumber: '03155449778',
  jazzcashName: 'ESSA ALI',
  instagram: [
    {
      handle: '@only_baig',
      url: 'https://www.instagram.com/only_baig/',
    },
    {
      handle: '@baig_treks_and_tours',
      url: 'https://www.instagram.com/baig_treks_and_tours/',
    },
  ],
  locationLabel: 'Gilgit-Baltistan & Northern Pakistan',
  tagline:
    'Explore Pakistan with Baig Treks and Tours — Customizable Tour Packages for Hunza, Skardu, Naran Kaghan, Kashmir & Northern Areas',
  heroHeadline: 'Pakistan Tour Packages & Northern Areas Tours',
  heroDescription:
    'Explore Hunza Valley, Skardu, Naran Kaghan, Kashmir (Neelum Valley), Fairy Meadows, and Deosai with Baig Treks and Tours. Customized private family holidays, honeymoon trips, and group tours across Northern Pakistan.',
  address: '',
  businessHours: '',
  cancellationPolicy:
    'Cancellation terms depend on the season, hotel reservation policies, and transport arrangements confirmed for your itinerary. Please contact Baig Treks & Tours directly via WhatsApp or email prior to making changes.',
  refundPolicy:
    'Refund eligibility is determined according to the advance commitments made for your specific tour dates and group size. Contact our team directly to review your booking.',
  bookingPolicy:
    'All tour bookings and custom itineraries are confirmed directly with Baig Treks & Tours after verifying travel dates, group size, and seasonal road/weather conditions.',
  paymentInstructions:
    'Confirm your tour dates and availability with Baig Treks & Tours via WhatsApp (03155449778) or email before sending your JazzCash transfer to 03155449778 (Account Name: ESSA ALI). Share your payment confirmation screenshot on WhatsApp for verification.',
  ctaText: 'Plan Your Custom Gilgit-Baltistan Expedition Today',
  footerInfo:
    'Authentic local tour operator specializing in Hunza, Skardu, Fairy Meadows, Deosai, and Karakoram expeditions.',
  seoTitle:
    'Baig Treks and Tours | Pakistan Tour Packages & Northern Areas',
  seoDescription:
    'Explore Pakistan with Baig Treks and Tours. Discover tour packages for Hunza, Skardu, Naran Kaghan, Kashmir and other northern areas of Pakistan.',
};

export function buildWhatsAppLink(message: string, whatsappNumber = defaultBusinessConfig.whatsapp): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '') || '923155449778';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildTourWhatsAppMessage(tourTitle: string, businessName = defaultBusinessConfig.name): string {
  return `Hello ${businessName}, I am interested in the "${tourTitle}" tour in Gilgit-Baltistan. Please share availability, itinerary details, and booking information.`;
}
