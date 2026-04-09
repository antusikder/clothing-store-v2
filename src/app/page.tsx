import Hero from '@/components/home/Hero';
import ProductCard from '@/components/products/ProductCard';
import { supabase, Product } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// High-Conversion Featured Grid
async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('Product')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data || data.length === 0) {
    console.warn('Using fallback data for demonstration');
    return [
      { id: '1', name: 'Royal Silk Panjabi - Ivory', description: 'Hand-woven pure silk Panjabi with intricate embroidery for premium occasions.', original_price: 5500, discount_price: 4800, image_url: 'https://images.unsplash.com/photo-1597983073453-ef90a7605d86?q=80&w=1000&auto=format&fit=crop', stock_quantity: 15, created_at: '' },
      { id: '2', name: 'Obsidian Black Hoodie', description: 'Ultra-heavy 450GSM cotton hoodie with minimalist aesthetic and oversized fit.', original_price: 3200, discount_price: 2600, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop', stock_quantity: 25, created_at: '' },
      { id: '3', name: 'Cloud White Essential Tee', description: 'Premium long-staple cotton T-shirt with a structured slim fit.', original_price: 1500, discount_price: 1100, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', stock_quantity: 60, created_at: '' },
      { id: '4', name: 'Artisan Cotton Panjabi - Teal', description: 'Breathable cotton Panjabi for comfortable daily wear with subtle detailing.', original_price: 3800, discount_price: 3200, image_url: 'https://images.unsplash.com/photo-1620015353895-4155170f031b?q=80&w=1000&auto=format&fit=crop', stock_quantity: 20, created_at: '' },
      { id: '5', name: 'Urban Minimalist Hoodie - Grey', description: 'Sleek grey hoodie designed for the modern street style.', original_price: 2800, discount_price: 2300, image_url: 'https://images.unsplash.com/photo-1556821840-4aef010771cb?q=80&w=1000&auto=format&fit=crop', stock_quantity: 30, created_at: '' },
      { id: '6', name: 'Vintage Indigo Graphic Tee', description: 'Soft-wash cotton tee with a retro graphic print.', original_price: 1600, discount_price: 1300, image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b721fa?q=80&w=1000&auto=format&fit=crop', stock_quantity: 40, created_at: '' },
      { id: '7', name: 'Heritage Collection Panjabi - Maroon', description: 'Deep maroon Panjabi with traditional craftsmanship.', original_price: 4500, discount_price: 3900, image_url: 'https://images.unsplash.com/photo-1615486511484-92e174cc4cf0?q=80&w=1000&auto=format&fit=crop', stock_quantity: 12, created_at: '' },
      { id: '8', name: 'Cyber Black Oversized Hoodie', description: 'Futuristic oversized fit with hidden pockets.', original_price: 3500, discount_price: 2900, image_url: 'https://images.unsplash.com/photo-1556821840-7e3f42337728?q=80&w=1000&auto=format&fit=crop', stock_quantity: 18, created_at: '' },
      { id: '9', name: 'Sage Green Relaxed Tee', description: 'Premium pima cotton tee in a calming sage green color.', original_price: 1400, discount_price: 1150, image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop', stock_quantity: 35, created_at: '' },
      { id: '10', name: 'Signature Series Panjabi - Charcoal', description: 'Modern cut charcoal grey Panjabi with matte finish.', original_price: 4200, discount_price: 3600, image_url: 'https://images.unsplash.com/photo-1615486511211-15d3986a4381?q=80&w=1000&auto=format&fit=crop', stock_quantity: 10, created_at: '' }
    ];
  }

  return data;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      <Hero />
      <div className="space-y-4 pt-4 pb-12" id="shop">
        <div className="container mx-auto px-4 md:px-6 mb-8 mt-16 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
            Curated <span className="text-accent">Brands</span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto font-medium mt-4">
            Browse our entire collection segmented by their dedicated brands and style families.
          </p>
        </div>

        {Object.entries(
          products.reduce((acc, product) => {
            const brand = (product as any).brand || 'Premium Selections';
            if (!acc[brand]) acc[brand] = [];
            acc[brand].push(product);
            return acc;
          }, {} as Record<string, typeof products>)
        ).map(([brand, items]) => (
          <section key={brand} className="py-12 border-t border-gray-100 dark:border-white/5">
            <div className="container mx-auto px-4 md:px-6">
              <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-8 inline-block border-b-4 border-accent pb-2">
                {brand}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="text-3xl font-black italic">FAST DELIVERY</div>
              <p className="text-gray-500 text-sm">Delivery across Bangladesh within 24-48 hours.</p>
            </div>
            <div className="space-y-4">
              <div className="text-3xl font-black italic">PREMIUM QUALITY</div>
              <p className="text-gray-500 text-sm">We use only high-grade materials for our garments.</p>
            </div>
            <div className="space-y-4">
              <div className="text-3xl font-black italic">EASY RETURNS</div>
              <p className="text-gray-500 text-sm">3-day return policy if you are not satisfied.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
