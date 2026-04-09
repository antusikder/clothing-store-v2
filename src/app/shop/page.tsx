import ProductCard from '@/components/products/ProductCard';
import { supabase, Product } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('Product')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return [];
  }
  return data;
}

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-16 text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
          Complete <span className="text-accent">Collection</span>
        </h1>
        <p className="text-gray-500 font-medium max-w-xl mx-auto">
          Explore our entire catalog. Premium fabrics, flawless construction. Filter by newest arrivals or specific brands.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">
          No products found in the catalog.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
