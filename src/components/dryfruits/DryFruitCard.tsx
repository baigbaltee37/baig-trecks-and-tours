import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Star,
  Check,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';
import { DryFruitProduct, WeightOption } from '../../data/dryFruitsData';
import { useCart } from '../../context/CartContext';

export const DryFruitCard: React.FC<{ product: DryFruitProduct }> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>('500g');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.imageUrl);

  const currentPrice = product.pricing[selectedWeight] || product.pricing['500g'];
  const totalItemPrice = currentPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const handleWeightChange = (weight: WeightOption) => {
    setSelectedWeight(weight);
  };

  const badgeColors = {
    Bestseller: 'bg-[#C5A46D] text-[#0D2B20]',
    'Organic GB': 'bg-[#174734] text-white',
    'Royal Reserve': 'bg-[#252B27] text-[#C5A46D]',
    'Seasonal Harvest': 'bg-emerald-700 text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="group bg-white border border-[#E8E4D9] hover:border-[#174734]/30 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={imgSrc}
            alt={`${product.name} — ${product.urduName}`}
            loading="lazy"
            onError={() => setImgSrc(product.fallbackImageUrl)}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Dark Overlay for bottom text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          {/* Badge Top Left */}
          {product.badge && (
            <div className="absolute top-3 left-3">
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-xs tracking-wide ${
                  badgeColors[product.badge] || 'bg-[#174734] text-white'
                }`}
              >
                {product.badge}
              </span>
            </div>
          )}

          {/* Origin Pill Top Right */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md border border-[#E8E4D9] text-[#174734] text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#C5A46D]" />
            <span className="truncate max-w-[130px]">{product.origin}</span>
          </div>

          {/* Rating Bottom Left */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 text-[#C5A46D] fill-[#C5A46D]" />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-white/60 text-[10px]">({product.reviewsCount})</span>
          </div>

          {/* Live Price Tag on Image Bottom Right */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-[#174734] text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-[#E8E4D9]">
            PKR {currentPrice.toLocaleString()} / {selectedWeight}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3.5">
          {/* Category & Urdu Name */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A46D]">
              {product.category}
            </span>
            <span className="text-xs font-semibold text-[#808D86] font-sans">
              {product.urduName}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-xl font-bold text-[#174734] group-hover:text-[#0D2B20] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#5A655F] line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Health Benefits Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.healthBenefits.slice(0, 2).map((b, i) => (
              <span
                key={i}
                className="text-[10px] font-medium text-[#174734] bg-[#F4F1E8] px-2 py-0.5 rounded-full"
              >
                ✓ {b}
              </span>
            ))}
          </div>

          {/* Weight Selection Controls */}
          <div className="space-y-1.5 pt-1 border-t border-[#E8E4D9]/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#252B27]">Select Weight:</span>
              <span className="text-[11px] text-[#808D86]">Sample price in PKR</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['250g', '500g', '1kg'] as WeightOption[]).map((w) => {
                const isSelected = selectedWeight === w;
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => handleWeightChange(w)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all text-center border ${
                      isSelected
                        ? 'bg-[#174734] text-white border-[#174734] shadow-xs'
                        : 'bg-[#F8F6F0] text-[#252B27] border-[#E8E4D9] hover:bg-[#EAE6DB]'
                    }`}
                  >
                    <div>{w}</div>
                    <div className="text-[10px] opacity-80 font-normal">
                      PKR {product.pricing[w].toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-5 pt-0 space-y-3">
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#E8E4D9]">
          {/* Quantity Controls */}
          <div className="flex items-center bg-[#F8F6F0] border border-[#E8E4D9] rounded-full p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-full bg-white hover:bg-[#EAE6DB] text-[#252B27] flex items-center justify-center transition-colors shadow-2xs"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-[#174734]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded-full bg-white hover:bg-[#EAE6DB] text-[#252B27] flex items-center justify-center transition-colors shadow-2xs"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 px-4 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-[#174734] hover:bg-[#0D2B20] text-white hover:shadow-md'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#C5A46D]" />
                <span>Add · PKR {totalItemPrice.toLocaleString()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
