'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { supabase } from '@/lib/supabase';
import { formatWhatsAppMessage } from '@/lib/utils';
import { BANGLADESH_DISTRICTS } from '@/lib/areas';
import { ShoppingBag, ChevronLeft, CreditCard, Home, Phone, User, Send, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    area: 'Dhaka',
    paymentMethod: 'bKash/Nagad Manual',
  });
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="p-6 bg-gray-50 dark:bg-slate-900 rounded-full mb-6">
          <ShoppingBag size={64} className="text-gray-200" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm">Add some premium pieces to your cart before checking out.</p>
        <Link href="/" className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-accent transition-all">
          Go to Collection
        </Link>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-full mb-6">
          <Send size={64} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Order Placed!</h1>
        <p className="text-gray-500 mb-8 max-w-sm">Your order has been recorded. We are redirecting you to WhatsApp to complete the payment.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-accent transition-all"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOrdering) return;
    setIsOrdering(true);

    const orderNumber = `MC-${Date.now().toString().slice(-6)}`;
    const total = subtotal();

    try {
      // 1. Save to Supabase
      const { error } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          area: formData.area,
          total_price: total,
          payment_method: formData.paymentMethod,
          status: 'Pending',
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            size: item.size,
            price: item.discount_price || item.original_price
          }))
        }]);

      if (error) throw error;

      // 2. Format and Open WhatsApp
      const message = formatWhatsAppMessage({
        name: formData.name,
        address: `${formData.address}, ${formData.area}`,
        phone: formData.phone,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          price: item.discount_price || item.original_price
        })),
        total: total,
      });

      window.open(message, '_blank');
      
      // 3. Finalize
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      console.error('Order Error:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors mb-12">
        <ChevronLeft size={16} /> Return to Store
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Checkout</h1>
            <p className="text-gray-500">Please provide your delivery details to complete the order.</p>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <User size={14} /> Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Abdullah Hasan"
                  className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-accent focus:bg-white dark:focus:bg-slate-900 rounded-2xl px-6 py-4 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Phone size={14} /> Phone Number
                </label>
                <input
                  required
                  type="tel"
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-accent focus:bg-white dark:focus:bg-slate-900 rounded-2xl px-6 py-4 outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <MapPin size={14} /> Select District
                </label>
                <select
                  required
                  className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-accent focus:bg-white dark:focus:bg-slate-900 rounded-2xl px-6 py-4 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                >
                  {BANGLADESH_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Home size={14} /> Full Address
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="House #, Road #, Area, City"
                  className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-accent focus:bg-white dark:focus:bg-slate-900 rounded-2xl px-6 py-4 outline-none transition-all resize-none"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            {/* Payment Instruction */}
            <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-accent/20 space-y-3">
              <div className="flex items-center justify-between text-accent font-bold uppercase tracking-tighter text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} /> Payment: {formData.paymentMethod}
                </div>
                <div className="flex gap-2">
                   <button 
                     type="button" 
                     onClick={() => setFormData({...formData, paymentMethod: 'bKash/Nagad Manual'})}
                     className={cn("px-2 py-1 text-[10px] rounded border", formData.paymentMethod.includes('bKash') ? "bg-accent text-white border-accent" : "border-accent/20")}
                   >bKash</button>
                   <button 
                     type="button"
                     onClick={() => setFormData({...formData, paymentMethod: 'Cash on Delivery'})}
                     className={cn("px-2 py-1 text-[10px] rounded border", formData.paymentMethod.includes('Cash') ? "bg-accent text-white border-accent" : "border-accent/20")}
                   >COD</button>
                </div>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-200/70 leading-relaxed font-medium">
                {formData.paymentMethod.includes('Cash') 
                  ? "Pay to the delivery person once you receive your package."
                  : "After placing the order, you will be redirected to WhatsApp. Our agent will provide the bKash/Nagad number for payment."}
              </p>
            </div>

            <button
              disabled={isOrdering}
              type="submit"
              className="w-full bg-accent text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-amber-600 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-accent/20 uppercase tracking-widest disabled:opacity-50 disabled:grayscale"
            >
              {isOrdering ? 'Saving Order...' : `Place Order - ৳${subtotal()}`} <Send size={20} />
            </button>
          </form>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 dark:bg-slate-900/50 p-8 rounded-3xl sticky top-32 space-y-8 border border-gray-100 dark:border-white/5">
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">Order Summary</h2>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative h-16 w-14 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] uppercase text-gray-400 font-bold">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-black">৳{(item.discount_price || item.original_price) * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>৳{subtotal()}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium text-sm">
                <span>Delivery Charge</span>
                <span className="text-accent underline underline-offset-4 font-bold uppercase italic">Free</span>
              </div>
              <div className="flex justify-between pt-4 text-2xl font-black">
                <span>Total</span>
                <span>৳{subtotal()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
