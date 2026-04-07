'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useCartDrawer } from '@/hooks/use-cart-drawer';
import Link from 'next/link';
import Image from 'next/image';

export default function CartDrawer() {
  const { isOpen, close } = useCartDrawer();
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-white/10 shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-bottom border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-accent" />
                <h2 className="text-lg font-bold">Shopping Cart</h2>
              </div>
              <button onClick={close} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-full">
                    <ShoppingBag size={48} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">Your cart is empty.</p>
                  <button onClick={close} className="text-sm font-bold text-accent hover:underline">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="relative h-24 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-bold line-clamp-1">{item.name}</h3>
                      {item.size && <p className="text-[10px] uppercase tracking-widest text-gray-400">Size: {item.size}</p>}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-accent"><Minus size={14}/></button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-accent"><Plus size={14}/></button>
                        </div>
                        <p className="text-sm font-bold">
                          ৳{(item.discount_price || item.original_price) * item.quantity}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="self-start text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-xl font-bold">৳{subtotal()}</span>
                </div>
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
                  Discounts and delivery applied at checkout
                </p>
                <Link 
                  href="/checkout" 
                  onClick={close}
                  className="w-full bg-accent hover:bg-amber-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 group"
                >
                  Checkout Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
