'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/lib/supabase';
import { useCart } from '@/hooks/use-cart';
import { useCartDrawer } from '@/hooks/use-cart-drawer';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const openCart = useCartDrawer((state) => state.open);

  const hasDiscount = product.discount_price && product.discount_price < product.original_price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.original_price - (product.discount_price || 0)) / product.original_price) * 100) 
    : 0;

  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart!`);
    openCart();
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    router.push('/checkout');
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Label/Badge */}
      {hasDiscount && (
        <div className="absolute top-4 left-4 z-10 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full">
          -{discountPercent}% OFF
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Hover Actions - Positioned as a sibling to the Link */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent flex gap-2 z-20">
          <button 
            type="button"
            onClick={handleAddToCart}
            className="flex-1 bg-white hover:bg-black hover:text-white text-black text-[10px] uppercase tracking-widest font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition-colors z-30 shadow-xl"
          >
            <ShoppingBag size={14} /> Cart
          </button>
          <button 
            type="button"
            onClick={handleBuyNow}
            className="flex-1 bg-accent text-white text-[10px] uppercase tracking-widest font-bold py-3 rounded-xl flex items-center justify-center transition-colors z-30 hover:scale-[1.02] active:scale-95 shadow-xl"
          >
            Buy Now
          </button>
          <Link href={`/product/${product.id}`} className="p-3 bg-white/20 backdrop-blur-md hover:bg-black rounded-xl text-white transition-colors z-30 flex items-center justify-center">
            <Eye size={16} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-1 text-center">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-500 hover:text-accent transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-center gap-2">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-foreground">৳{product.discount_price}</span>
              <span className="text-sm text-gray-400 line-through">৳{product.original_price}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-foreground">৳{product.original_price}</span>
          )}
        </div>
      </div>
    </div>
  );
}
