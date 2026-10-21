import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MessageCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  FileText,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useCart, CustomerOrderDetails } from '../../context/CartContext';
import { DRY_FRUITS_WHATSAPP_NUMBER } from '../../data/dryFruitsData';

const COMMON_CITIES = [
  'Islamabad',
  'Rawalpindi',
  'Lahore',
  'Karachi',
  'Peshawar',
  'Faisalabad',
  'Multan',
  'Sialkot',
  'Gujranwala',
  'Quetta',
  'Gilgit',
  'Skardu',
  'Other City',
];

export const WhatsAppCheckoutModal: React.FC = () => {
  const {
    cart,
    subtotal,
    deliveryFee,
    total,
    isCheckoutOpen,
    closeCheckout,
    generateWhatsAppOrderUrl,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDispatched, setIsDispatched] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

  if (!isCheckoutOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = customerName.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = deliveryAddress.trim();

    if (!cleanName || !cleanPhone || !cleanAddress) {
      setErrorMsg('Please provide your name, phone/WhatsApp number, and delivery address.');
      return;
    }

    if (cart.length === 0) {
      setErrorMsg('Your basket is empty. Please add items before placing an order.');
      return;
    }

    const orderDetails: CustomerOrderDetails = {
      customerName: cleanName,
      phone: cleanPhone,
      city,
      deliveryAddress: cleanAddress,
      notes: notes.trim(),
    };

    const whatsappUrl = generateWhatsAppOrderUrl(orderDetails);
    setGeneratedUrl(whatsappUrl);
    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // In case iframe restricts automatic popups, user can click the button
    }
    setIsDispatched(true);
  };

  const handleModalClose = () => {
    setIsDispatched(false);
    setGeneratedUrl('');
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={handleModalClose}
        aria-hidden="true"
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block w-full max-w-xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white border border-[#E8E4D9] rounded-3xl shadow-2xl relative z-10"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-[#F8F6F0] border-b border-[#E8E4D9] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#174734] text-white flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-[#C5A46D]" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#174734]">
                  WhatsApp Fast Checkout
                </h3>
                <p className="text-xs text-[#5A655F]">
                  Order directly via official WhatsApp ({DRY_FRUITS_WHATSAPP_NUMBER})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleModalClose}
              className="p-2 text-[#808D86] hover:text-[#252B27] hover:bg-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isDispatched ? (
            /* Post-dispatch confirmation screen */
            <div className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#174734] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9 text-[#174734]" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-2xl font-bold text-[#174734]">
                  WhatsApp Ready to Send!
                </h4>
                <p className="text-xs sm:text-sm text-[#5A655F] max-w-md mx-auto leading-relaxed">
                  We opened WhatsApp with your prefilled order breakdown. Please tap <strong className="text-[#174734]">Send</strong> in WhatsApp so our team in Skardu/Islamabad can immediately confirm and pack your fresh parcel.
                </p>
              </div>

              <div className="p-4 bg-[#F8F6F0] border border-[#E8E4D9] rounded-2xl text-xs text-[#5A655F] text-left space-y-1.5">
                <div className="font-semibold text-[#174734] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  What happens next?
                </div>
                <p>1. Our representative confirms stock freshness &amp; payment choice (COD or Bank advance).</p>
                <p>2. Your package is packed in airtight vacuum pouches and handed to the courier (TCS/Leopards).</p>
                <p>3. You receive your tracking ID directly on WhatsApp.</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                {generatedUrl && (
                  <a
                    href={generatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>Open WhatsApp</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-6 py-2.5 rounded-full bg-[#174734] text-white font-semibold text-xs sm:text-sm hover:bg-[#0D2B20] transition-colors"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={() => setIsDispatched(false)}
                  className="px-6 py-2.5 rounded-full bg-[#F8F6F0] text-[#174734] border border-[#E8E4D9] font-semibold text-xs sm:text-sm hover:bg-[#EAE6DB] transition-colors"
                >
                  Review Details
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Order Summary Mini Box */}
              <div className="p-4 bg-[#F8F6F0] border border-[#E8E4D9] rounded-2xl space-y-2 text-xs">
                <div className="font-semibold text-[#174734] flex items-center justify-between border-b border-[#E8E4D9] pb-2">
                  <span>Order Summary ({cart.length} items)</span>
                  <span className="font-bold text-sm">PKR {total.toLocaleString()}</span>
                </div>
                <div className="max-h-28 overflow-y-auto space-y-1 text-[#5A655F] pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-[11px]">
                      <span className="truncate pr-2">
                        {item.name} ({item.weight}) × {item.quantity}
                      </span>
                      <span className="font-medium text-[#252B27] shrink-0">
                        PKR {(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-1.5 border-t border-[#E8E4D9]/60 flex items-center justify-between text-[11px] text-[#5A655F]">
                  <span>Delivery:</span>
                  <span className="font-medium text-[#174734]">
                    {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee}`}
                  </span>
                </div>
              </div>

              {/* Delivery Details Inputs */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#252B27] mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#174734]" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Asad Baig"
                    className="w-full px-4 py-2.5 bg-[#F8F6F0] border border-[#E8E4D9] rounded-xl text-xs sm:text-sm text-[#252B27] focus:outline-none focus:border-[#174734] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#252B27] mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#174734]" />
                      <span>WhatsApp / Mobile *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0315-5449778"
                      className="w-full px-4 py-2.5 bg-[#F8F6F0] border border-[#E8E4D9] rounded-xl text-xs sm:text-sm text-[#252B27] focus:outline-none focus:border-[#174734] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#252B27] mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#174734]" />
                      <span>City *</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F8F6F0] border border-[#E8E4D9] rounded-xl text-xs sm:text-sm text-[#252B27] focus:outline-none focus:border-[#174734] transition-colors"
                    >
                      {COMMON_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#252B27] mb-1.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#174734]" />
                    <span>Complete Street / Delivery Address *</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House / Flat #, Street, Sector / Area name..."
                    className="w-full px-4 py-2.5 bg-[#F8F6F0] border border-[#E8E4D9] rounded-xl text-xs sm:text-sm text-[#252B27] focus:outline-none focus:border-[#174734] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#252B27] mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#174734]" />
                    <span>Order Notes / Instructions (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call before delivery, gift wrap, etc."
                    className="w-full px-4 py-2.5 bg-[#F8F6F0] border border-[#E8E4D9] rounded-xl text-xs sm:text-sm text-[#252B27] focus:outline-none focus:border-[#174734] transition-colors"
                  />
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                ℹ️ <strong>Note:</strong> Tapping the button below will open your WhatsApp with this exact order prefilled. The order is only placed when you tap Send on WhatsApp.
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-5 py-3 text-xs sm:text-sm font-medium rounded-full bg-slate-100 hover:bg-slate-200 text-[#252B27] transition-colors"
                >
                  Back to Basket
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#174734] hover:bg-[#0D2B20] text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#C5A46D]" />
                  <span>Send Order via WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};
