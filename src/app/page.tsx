import Hero from '@/components/home/Hero';
import ProductCard from '@/components/products/ProductCard';
import { supabase, Product } from '@/lib/supabase';

// High-Conversion Featured Grid
async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('Product')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);

  if (error || !data || data.length === 0) {
    console.warn('Using fallback data for demonstration');
    return [
      {
        id: '1',
        name: 'Premium Silk Panjabi',
        description: 'Elegant hand-crafted silk Panjabi for formal occasions.',
        original_price: 4500,
        discount_price: 3999,
        image_url: 'https://images.unsplash.com/photo-1597983073453-ef90a7605d86?q=80&w=1000&auto=format&fit=crop',
        stock_quantity: 10,
        created_at: ''
      },
      {
        id: '2',
        name: 'Midnight Black Hoodie',
        description: 'Essential heavyweight cotton hoodie with fleece lining.',
        original_price: 2500,
        discount_price: 1800,
        image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
        stock_quantity: 20,
        created_at: ''
      },
      {
        id: '3',
        name: 'Essential White T-Shirt',
        description: 'Premium breathable cotton slim-fit white tee.',
        original_price: 1200,
        discount_price: 950,
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
        stock_quantity: 50,
        created_at: ''
      },
      {
        id: '4',
        name: 'Graphic Streetwear Tee',
        description: 'Modern oversized graphic print t-shirt.',
        original_price: 1500,
        discount_price: 1200,
        image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b721fa?q=80&w=1000&auto=format&fit=crop',
        stock_quantity: 15,
        created_at: ''
      },
      {
        id: '5',
        name: 'Charcoal Grey Hoodie',
        description: 'Minimalist aesthetic grey hoodie for daily wear.',
        original_price: 2500,
        discount_price: 2200,
        image_url: 'https://images.unsplash.com/photo-1556821840-4aef010771cb?q=80&w=1000&auto=format&fit=crop',
        stock_quantity: 12,
        created_at: ''
      },
      {
        id: '6',
        name: 'Heritage Collection Panjabi',
        description: 'Classic cotton Panjabi with traditional embroidery.',
        original_price: 3500,
        discount_price: 2900,
        image_url: 'https://images.unsplash.com/photo-1620015353895-4155170f031b?q=80&w=1000&auto=format&fit=crop',
        stock_quantity: 8,
        created_at: ''
      }
    ];
  }

  return data;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      <Hero />
      
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">
                Featured <span className="text-accent">Collection</span>
              </h2>
              <p className="text-gray-500 max-w-md font-medium">
                Our most popular pieces, carefully selected for style and quality. 
                Experience the best of Modern Cloth.
              </p>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest border-b-2 border-accent pb-1 hover:text-accent transition-colors">
              View All Products
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

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
              <p className="text-gray-500 text-sm">No questions asked 3-day return policy.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
