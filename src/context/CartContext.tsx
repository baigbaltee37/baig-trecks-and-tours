import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { DryFruitProduct, WeightOption, DRY_FRUITS_WHATSAPP_NUMBER } from '../data/dryFruitsData';
import { buildWhatsAppLink } from '../config/business';

export interface CartItem {
  id: string; // e.g. "almonds-badam-500g"
  productId: string;
  name: string;
  urduName: string;
  weight: WeightOption;
  unitPrice: number; // Price for the selected weight
  quantity: number;
  imageUrl: string;
}

export interface CustomerOrderDetails {
  customerName: string;
  phone: string;
  city: string;
  deliveryAddress: string;
  notes?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  isFreeDelivery: boolean;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addToCart: (product: DryFruitProduct, weight: WeightOption, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  generateWhatsAppOrderUrl: (details: CustomerOrderDetails) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'baig_dry_fruits_cart_v1';
export const FREE_DELIVERY_THRESHOLD = 3500;
export const STANDARD_DELIVERY_FEE = 250;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore parsing errors
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD && subtotal > 0;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const addToCart = (product: DryFruitProduct, weight: WeightOption, quantity = 1) => {
    const unitPrice = product.pricing[weight] || 0;
    const cartItemId = `${product.id}-${weight}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          quantity: nextCart[existingIndex].quantity + quantity,
        };
        return nextCart;
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          urduName: product.urduName,
          weight,
          unitPrice,
          quantity,
          imageUrl: product.imageUrl,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const generateWhatsAppOrderUrl = (details: CustomerOrderDetails): string => {
    const lines = [
      `*NEW DRY FRUITS ORDER — BAIG DRY FRUITS*`,
      `---------------------------------------`,
      `*Customer Information:*`,
      `• Name: ${details.customerName}`,
      `• Phone: ${details.phone}`,
      `• City: ${details.city}`,
      `• Delivery Address: ${details.deliveryAddress}`,
    ];

    if (details.notes?.trim()) {
      lines.push(`• Order Notes: ${details.notes.trim()}`);
    }

    lines.push(``);
    lines.push(`*Ordered Items:*`);

    cart.forEach((item, index) => {
      const lineTotal = item.unitPrice * item.quantity;
      lines.push(
        `${index + 1}. *${item.name}* (${item.weight})\n   Qty: ${item.quantity} × PKR ${item.unitPrice.toLocaleString()} = PKR ${lineTotal.toLocaleString()}`
      );
    });

    lines.push(`---------------------------------------`);
    lines.push(`*Subtotal:* PKR ${subtotal.toLocaleString()}`);
    lines.push(
      `*Delivery Fee:* ${
        deliveryFee === 0
          ? 'FREE (Nationwide Delivery)'
          : `PKR ${deliveryFee.toLocaleString()} (Standard Delivery)`
      }`
    );
    lines.push(`*FINAL TOTAL:* PKR ${total.toLocaleString()}`);
    lines.push(`---------------------------------------`);
    lines.push(`_Please confirm stock availability, bank/JazzCash details, and dispatch timeframe._`);

    const fullMessage = lines.join('\n');
    return buildWhatsAppLink(fullMessage, DRY_FRUITS_WHATSAPP_NUMBER);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        deliveryFee,
        total,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        amountNeededForFreeDelivery,
        isFreeDelivery,
        isCartOpen,
        isCheckoutOpen,
        openCart,
        closeCart,
        toggleCart,
        openCheckout,
        closeCheckout,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        generateWhatsAppOrderUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
