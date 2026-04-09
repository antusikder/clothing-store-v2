'use client';

export const dynamic = 'force-dynamic';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Star, ShieldCheck, Truck, RefreshCw, ChevronLeft } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useCartDrawer } from '@/hooks/use-cart-drawer';
import { supabase, Product } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [selectedSize, setSelectedSize] = useState('M');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const addItem = useCart((state) => state.addItem);
  const openCart = useCartDrawer((state) => state.open);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase.from('Product').select('*').eq('id', id).single();
      if (data) setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center font-bold text-gray-500 animate-pulse">Loading collection...</div>;
  }

  if (!product) {
    return <div className="min-h-[70vh] flex items-center justify-center font-bold text-gray-500">Product not found.</div>;
  }

  const hasDiscount = product.discount_price && product.discount_price < product.original_price;

  const handleAddToCart = () => {
    addItem(product, selectedSize);
    toast.success(`${product.name} added to cart!`);
    openCart();
  };

  const handleBuyNow = () => {
    addItem(product, selectedSize);
    router.push('/checkout');
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
              className="flex-1 bg-black text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-800 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10 uppercase tracking-widest text-sm"
            >
              <ShoppingBag size={20} /> Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-accent text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-amber-600 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20 uppercase tracking-widest text-sm"
            >
              Buy Now
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
