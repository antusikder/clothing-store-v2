'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useCartDrawer } from '@/hooks/use-cart-drawer';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const totalItems = useCart((state) => state.totalItems());
  const openCart = useCartDrawer((state) => state.open);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-foreground">
            <Menu size={24} />
          </button>
          <Link href="/" className="text-2xl font-bold tracking-tighter text-foreground italic">
            MODERN<span className="text-accent">CLOTH</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-foreground/80">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-accent transition-colors">Shop</Link>
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-foreground/70 hover:text-foreground transition-colors">
            <Search size={22} />
          </button>
          <button 
            onClick={openCart}
            className="relative p-2 text-foreground hover:text-accent transition-colors"
          >
            <ShoppingBag size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
