import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Truck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    subtotal,
    deliveryFee,
    total,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
    isFreeDelivery,
    isCartOpen,
    closeCart,
    openCheckout,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-[#F8F6F0] border-l border-[#E8E4D9] shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="px-5 py-4 border-b border-[#E8E4D9] bg-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#174734]/10 text-[#174734] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-[#174734]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#174734]">
                      Your Dry Fruits Basket
                    </h2>
                    <p className="text-xs text-[#5A655F]">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cart.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-[11px] font-medium text-[#808D86] hover:text-red-600 transition-colors px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeCart}
                    className="p-2 text-[#252B27] hover:bg-[#F0EDE4] rounded-full transition-colors"
                    aria-label="Close cart"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Free Delivery Incentive Progress Bar */}
              <div className="px-5 py-2.5 bg-[#F4F1E8] border-b border-[#E8E4D9] text-xs">
                <div className="flex items-center justify-between font-medium text-[#174734] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#C5A46D]" />
                    {isFreeDelivery ? (
                      <span className="font-bold text-emerald-800">
                        🎉 Free Nationwide Delivery Unlocked!
                      </span>
                    ) : (
                      <span>
                        Add{' '}
                        <strong className="text-[#174734]">
                          PKR {amountNeededForFreeDelivery.toLocaleString()}
                        </strong>{' '}
                        more for Free Shipping
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-[#5A655F]">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#E8E4D9] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isFreeDelivery ? 'bg-emerald-600' : 'bg-[#174734]'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Drawer Body — Items List */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#EAE6DB] text-[#808D86] flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-[#808D86]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-xl font-bold text-[#174734]">
                        Your basket is empty
                      </h3>
                      <p className="text-xs text-[#5A655F] max-w-xs leading-relaxed">
                        Discover pure handpicked almonds, kaghzi walnuts, roasted cashews, and wild mountain chilgoza directly from Northern Pakistan.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeCart}
                      className="px-6 py-2.5 text-xs font-semibold rounded-full bg-[#174734] text-white hover:bg-[#0D2B20] transition-colors shadow-xs"
                    >
                      Browse Dry Fruits
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white border border-[#E8E4D9] rounded-2xl p-3.5 shadow-xs flex items-center gap-3"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-[#E8E4D9]">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="font-serif text-sm font-bold text-[#174734] truncate">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-[#808D86] -mt-0.5">
                              {item.urduName}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#808D86] hover:text-red-600 transition-colors p-1"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Weight Tag & Price */}
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8F6F0] text-[#174734] border border-[#E8E4D9]">
                            {item.weight}
                          </span>
                          <span className="text-xs font-bold text-[#174734]">
                            PKR {(item.unitPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8E4D9]/60">
                          <span className="text-[10px] text-[#808D86]">
                            PKR {item.unitPrice.toLocaleString()} / {item.weight}
                          </span>
                          <div className="flex items-center gap-1.5 bg-[#F8F6F0] rounded-full border border-[#E8E4D9] p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-5 h-5 rounded-full bg-white hover:bg-[#EAE6DB] text-[#252B27] flex items-center justify-center transition-colors shadow-2xs"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-1.5 min-w-[18px] text-center text-[#174734]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-5 h-5 rounded-full bg-white hover:bg-[#EAE6DB] text-[#252B27] flex items-center justify-center transition-colors shadow-2xs"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Drawer Footer with Calculations & WhatsApp Checkout Button */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-[#E8E4D9] bg-white space-y-3 shadow-lg">
                  <div className="space-y-1.5 text-xs text-[#5A655F]">
                    <div className="flex items-center justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-semibold text-[#252B27]">
                        PKR {subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <span>Nationwide Delivery</span>
                        {isFreeDelivery && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                            FREE
                          </span>
                        )}
                      </span>
                      <span className="font-semibold text-[#252B27]">
                        {deliveryFee === 0
                          ? 'FREE'
                          : `PKR ${deliveryFee.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#E8E4D9] flex items-center justify-between text-base">
                      <span className="font-serif font-bold text-[#174734]">
                        Total (PKR)
                      </span>
                      <span className="font-serif text-lg font-bold text-[#174734]">
                        PKR {total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Primary WhatsApp Checkout CTA */}
                  <button
                    type="button"
                    onClick={openCheckout}
                    className="w-full py-3.5 px-4 rounded-full bg-[#174734] hover:bg-[#0D2B20] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
                  >
                    <MessageCircle className="w-4 h-4 text-[#C5A46D]" />
                    <span>Proceed to WhatsApp Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-3 text-[11px] text-[#808D86]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Freshness Guaranteed
                    </span>
                    <span>·</span>
                    <span>Cash on Delivery / Bank Transfer</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
