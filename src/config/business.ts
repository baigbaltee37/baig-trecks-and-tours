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
    label: string;
  }[];
  locationLabel: string;
  address: string;
  businessHours: string;
  googleMapsUrl: string;
  facebook: string;
  youtube: string;
  tagline: string;
  heroHeadline: string;
  heroDescription: string;
  cancellationPolicy: string;
  refundPolicy: string;
  bookingPolicy: string;
  paymentInstructions: string;
}

export const defaultBusinessConfig: BusinessConfig = {
  name: 'Baig Trecks & Tours',
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
      label: 'Official Perspective (@only_baig)',
    },
    {
      handle: '@baig_treks_and_tours',
      url: 'https://www.instagram.com/baig_treks_and_tours/',
      label: 'Expeditions & Tours (@baig_treks_and_tours)',
    },
  ],
  locationLabel: 'GILGIT-BALTISTAN • PAKISTAN',
  address: '',
  businessHours: '',
  googleMapsUrl: '',
  facebook: '',
  youtube: '',
  tagline: 'Experience the Majestic Beauty of Gilgit-Baltistan',
  heroHeadline: 'EXPERIENCE THE MAJESTIC BEAUTY OF GILGIT-BALTISTAN',
  heroDescription:
    'Discover breathtaking valleys, legendary mountain landscapes, rich cultures and unforgettable journeys through Northern Pakistan with Baig Trecks & Tours.',
  cancellationPolicy: '',
  refundPolicy: '',
  bookingPolicy: '',
  paymentInstructions:
    'After Baig Trecks & Tours confirms your travel dates, availability, and final package price, you may reserve your seat using the official JazzCash account details displayed below and share your transaction reference on WhatsApp for manual verification.',
};

export function buildWhatsAppLink(message: string, whatsappNumber = defaultBusinessConfig.whatsapp): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '') || '923155449778';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildTourWhatsAppMessage(tourTitle: string, businessName = defaultBusinessConfig.name): string {
  return `Hello ${businessName}, I am interested in booking the ${tourTitle}. Please send me the latest price, availability and booking details.`;
}

// Future Payment Provider Abstraction Layer (Section 46)
export interface PaymentInstructionResult {
  providerId: 'jazzcash' | 'bank_transfer' | 'card_future';
  displayName: string;
  isLiveApiIntegrated: boolean;
  accountNumber?: string;
  accountTitle?: string;
  instructions: string;
}

export abstract class PaymentProvider {
  abstract getInstructions(config: BusinessConfig): PaymentInstructionResult;
}

export class JazzCashManualProvider extends PaymentProvider {
  getInstructions(config: BusinessConfig): PaymentInstructionResult {
    return {
      providerId: 'jazzcash',
      displayName: 'JazzCash Payment',
      isLiveApiIntegrated: false,
      accountNumber: config.jazzcashNumber,
      accountTitle: config.jazzcashName,
      instructions:
        config.paymentInstructions ||
        'Confirm availability with Baig Trecks & Tours prior to transferring funds. All payments are verified manually by our team.',
    };
  }
}

export const paymentProvider = new JazzCashManualProvider();
