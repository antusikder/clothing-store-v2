'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Star, ShieldCheck, Truck, RefreshCw, ChevronLeft } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useCartDrawer } from '@/hooks/use-cart-drawer';
import { Product } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Fallback data helper (since we're client-side for simplicity in this demo)
const fallbackProducts: Record<string, Product> = {
  '1': { id: '1', name: 'Premium Silk Panjabi', description: 'Elegant hand-crafted silk Panjabi for formal occasions. Breathable fabric with traditional embroidery.', original_price: 4500, discount_price: 3999, image_url: 'https://images.unsplash.com/photo-1597983073453-ef90a7605d86?q=80&w=1000&auto=format&fit=crop', stock_quantity: 10, created_at: '' },
  '2': { id: '2', name: 'Midnight Black Hoodie', description: 'Essential heavyweight cotton hoodie with fleece lining. Perfect for winter comfort.', original_price: 2500, discount_price: 1800, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop', stock_quantity: 20, created_at: '' },
  '3': { id: '3', name: 'Essential White T-Shirt', description: 'Premium breathable cotton slim-fit white tee. A staple for every wardrobe.', original_price: 1200, discount_price: 950, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', stock_quantity: 50, created_at: '' },
  '4': { id: '4', name: 'Graphic Streetwear Tee', description: 'Modern oversized graphic print t-shirt. Street-ready design.', original_price: 1500, discount_price: 1200, image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b721fa?q=80&w=1000&auto=format&fit=crop', stock_quantity: 15, created_at: '' },
  '5': { id: '5', name: 'Charcoal Grey Hoodie', description: 'Minimalist aesthetic grey hoodie for daily wear. Durable and stylish.', original_price: 2500, discount_price: 2200, image_url: 'https://images.unsplash.com/photo-1556821840-4aef010771cb?q=80&w=1000&auto=format&fit=crop', stock_quantity: 12, created_at: '' },
  '6': { id: '6', name: 'Heritage Collection Panjabi', description: 'Classic cotton Panjabi with traditional embroidery. Perfect for cultural events.', original_price: 3500, discount_price: 2900, image_url: 'https://images.unsplash.com/photo-1620015353895-4155170f031b?q=80&w=1000&auto=format&fit=crop', stock_quantity: 8, created_at: '' },
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [selectedSize, setSelectedSize] = useState('M');
  const addItem = useCart((state) => state.addItem);
  const openCart = useCartDrawer((state) => state.open);

  const product = fallbackProducts[id];

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
  }

  const hasDiscount = product.discount_price && product.discount_price < product.original_price;

  const handleAddToCart = () => {
    addItem(product, selectedSize);
    openCart();
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors mb-8 group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Details */}
        <div className="space-y-8 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex text-accent">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span className="text-xs text-gray-400 font-medium">(24 Reviews)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">{product.name}</h1>
            <div className="flex items-center gap-4">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-bold text-primary">৳{product.discount_price}</span>
                  <span className="text-xl text-gray-400 line-through">৳{product.original_price}</span>
                  <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full uppercase">Save ৳{product.original_price - (product.discount_price || 0)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary">৳{product.original_price}</span>
              )}
            </div>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md">
              {product.description}
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Select Size</label>
            <div className="flex gap-3">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "w-12 h-12 rounded-xl border-2 font-bold transition-all text-sm",
                    selectedSize === size 
                      ? "border-accent bg-accent text-white scale-110 shadow-lg shadow-accent/20" 
                      : "border-gray-100 dark:border-white/5 hover:border-gray-300"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-accent hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10"
            >
              <ShoppingBag size={20} /> Add to Cart
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg"><Truck size={18} className="text-gray-400" /></div>
              <span className="text-xs font-medium text-gray-500">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg"><RefreshCw size={18} className="text-gray-400" /></div>
              <span className="text-xs font-medium text-gray-500">3 Days Return</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg"><ShieldCheck size={18} className="text-gray-400" /></div>
              <span className="text-xs font-medium text-gray-500">Quality Assured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
