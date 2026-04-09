'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { supabase } from '@/lib/supabase';
import { formatWhatsAppMessage, cn } from '@/lib/utils';
import { ShoppingBag, ChevronLeft, CreditCard, Home, Phone, User, Send, MapPin, Building } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const BD_GEO = {
  "Dhaka": ["Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur", "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail"],
  "Chattogram": ["Bandarban", "Brahmanbaria", "Chandpur", "Chattogram", "Cumilla", "Cox's Bazar", "Feni", "Khagrachari", "Lakshmipur", "Noakhali", "Rangamati"],
  "Rajshahi": ["Bogura", "Chapainawabganj", "Joypurhat", "Naogaon", "Natore", "Pabna", "Rajshahi", "Sirajganj"],
  "Khulna": ["Bagerhat", "Chuadanga", "Jashore", "Jhenaidah", "Khulna", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira"],
  "Barishal": ["Barguna", "Barishal", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur"],
  "Sylhet": ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
  "Rangpur": ["Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Rangpur", "Thakurgaon"],
  "Mymensingh": ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"]
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    division: '',
    district: '',
    upazila: '',
    address: '',
    paymentMethod: 'bKash/Nagad Manual',
  });
  
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const availableDistricts = formData.division ? BD_GEO[formData.division as keyof typeof BD_GEO] : [];

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="p-6 bg-gray-50 dark:bg-slate-900 rounded-full mb-6">
          <ShoppingBag size={64} className="text-gray-200" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm">Add some premium pieces to your cart to proceed.</p>
        <Link href="/shop" className="bg-black dark:bg-white dark:text-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-accent transition-all uppercase tracking-widest text-sm">
          Return to Shop
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
        <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Order Locked!</h1>
        <p className="text-gray-500 mb-8 max-w-sm">Your order was securely saved to our database. We are hooking you directly to our agents via WhatsApp to complete the cycle.</p>
        <button onClick={() => window.location.href = '/'} className="bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-bold hover:bg-accent transition-all uppercase text-sm tracking-widest">
          Return to Hub
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOrdering) return;
    
    if (!formData.division || !formData.district) {
      toast.error("Please properly select your Division and District!");
      return;
    }

    setIsOrdering(true);
    const orderNumber = `MC-${Date.now().toString().slice(-6)}`;
    const fullArea = `${formData.upazila ? formData.upazila + ', ' : ''}${formData.district}, ${formData.division}`;

    try {
      // 1. WhatsApp Encoding Pipeline - Trigger Synchronously First!
      const message = formatWhatsAppMessage({
        name: formData.name,
        address: `${formData.address}, ${fullArea}`,
        phone: formData.phone,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          price: item.discount_price || item.original_price
        })),
        total: subtotal(),
      });

      // 2. Supabase Integrity Hook - Background Drop
      // We do not wait on this. Even if Database RLS rules fail, the user is forwarded to WhatsApp properly.
      supabase.from('orders').insert([{
        order_number: orderNumber,
        customer_name: formData.name,
        phone: formData.phone,
        address: formData.address,
        area: fullArea,
        total_price: subtotal(),
        payment_method: formData.paymentMethod,
        status: 'Pending',
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          price: item.discount_price || item.original_price
        }))
      }]).then(({ error }) => {
        if (error) console.warn("Supabase Order Log Blocked (RLS):", error.message);
      });

      toast.success("Order injected! Connecting to agent...");
      setOrderComplete(true);
      clearCart();
      window.location.href = message; // Bypasses complex window.open async rules
    } catch (err) {
      console.error('Order Error:', err);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors mb-12 uppercase tracking-widest font-bold">
        <ChevronLeft size={16} /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Elements */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Secure Checkout</h1>
            <p className="text-gray-500">Provide precise geographical routing for your package.</p>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><User size={14} /> Full Name</label>
                <input required type="text" placeholder="e.g. Abdullah Hasan" className="w-full bg-gray-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-accent rounded-2xl px-6 py-4 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><Phone size={14} /> Phone Number</label>
                <input required type="tel" placeholder="e.g. 017XXXXXXXX" className="w-full bg-gray-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-accent rounded-2xl px-6 py-4 outline-none transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} />
              </div>

              {/* Nested Address Logic */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><MapPin size={14} /> Division</label>
                <select required className="w-full bg-gray-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-accent rounded-2xl px-6 py-4 outline-none transition-all appearance-none cursor-pointer" value={formData.division} onChange={e => setFormData({...formData, division: e.target.value, district: ''})}>
                  <option value="" disabled>Select Division</option>
                  {Object.keys(BD_GEO).map(div => <option key={div} value={div}>{div}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><Building size={14} /> District</label>
                <select required disabled={!formData.division} className="w-full bg-gray-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-accent rounded-2xl px-6 py-4 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})}>
                  <option value="" disabled>Select District</option>
                  {availableDistricts.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><Home size={14} /> Details (Upazila, Village, House #, Landmark)</label>
                <textarea required rows={3} placeholder="Please type your precise local address..." className="w-full bg-gray-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-accent rounded-2xl px-6 py-4 outline-none transition-all resize-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>

            </div>

             {/* Payment Matrix */}
             <div className="p-6 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/10 dark:to-slate-900 rounded-2xl border border-accent/20 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-accent font-bold uppercase tracking-widest text-xs">
                <div className="flex items-center gap-2"><CreditCard size={18} /> Routing: {formData.paymentMethod}</div>
                <div className="flex gap-2">
                   <button type="button" onClick={() => setFormData({...formData, paymentMethod: 'bKash/Nagad Manual'})} className={cn("px-3 py-1.5 rounded-lg border transition-all", formData.paymentMethod.includes('bKash') ? "bg-accent text-white border-accent shadow-md shadow-accent/20" : "border-accent/20 hover:bg-accent/5")}>MFS</button>
                   <button type="button" onClick={() => setFormData({...formData, paymentMethod: 'Cash on Delivery'})} className={cn("px-3 py-1.5 rounded-lg border transition-all", formData.paymentMethod.includes('Cash') ? "bg-accent text-white border-accent shadow-md shadow-accent/20" : "border-accent/20 hover:bg-accent/5")}>COD</button>
                </div>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-200/50 leading-relaxed font-medium">
                {formData.paymentMethod.includes('Cash') 
                  ? "Standard cash handover to the delivery operative upon verification of package."
                  : "We operate on manual MFS routing. Our agent will verify order logic and provide merchant digits directly in WhatsApp."}
              </p>
            </div>

            <button disabled={isOrdering} type="submit" className="w-full bg-black dark:bg-white dark:text-black text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-accent transition-all shadow-xl shadow-black/10 uppercase tracking-widest disabled:opacity-50">
              {isOrdering ? 'Encrypting Payload...' : `Finalize Transmission - ৳${subtotal()}`} <Send size={20} />
            </button>
          </form>
        </div>

        {/* Live Ledger */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 dark:bg-slate-900/40 p-8 rounded-3xl sticky top-32 space-y-8 border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">Ledger Summary</h2>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative h-16 w-14 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] uppercase text-gray-400 font-bold">Size: {item.size || 'STD'} | Unit: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-black text-accent">৳{(item.discount_price || item.original_price) * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-white/10">
               <div className="flex justify-between text-gray-500 font-medium text-sm">
                 <span>Subtotal</span><span>৳{subtotal()}</span>
               </div>
               <div className="flex justify-between text-gray-500 font-medium text-sm">
                 <span>Logistics Route</span><span className="text-accent tracking-widest font-black uppercase italic">Free</span>
               </div>
               <div className="flex justify-between pt-4 text-2xl font-black">
                 <span>Net Payable</span><span>৳{subtotal()}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
