'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PackagePlus, Upload, ListOrdered, RefreshCw, LockKeyhole } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'publish' | 'orders'>('publish');
  
  // Publish State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    original_price: '',
    discount_price: '',
    image_url: '',
    stock_quantity: '10'
  });
  const [loading, setLoading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) fetchOrders();
  }, [activeTab, isAuthenticated]);

  const fetchOrders = async () => {
    setFetchingOrders(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) setOrders(data);
    setFetchingOrders(false);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.from('Product').insert([{
        name: formData.name,
        brand: formData.brand || 'Apparel', // Fallback to generic if empty
        description: formData.description,
        original_price: Number(formData.original_price),
        discount_price: formData.discount_price ? Number(formData.discount_price) : null,
        image_url: formData.image_url,
        stock_quantity: Number(formData.stock_quantity)
      }]);

      if (error) throw error;
      toast.success('Product Published Successfully!');
      setFormData({ name: '', brand: '', description: '', original_price: '', discount_price: '', image_url: '', stock_quantity: '10' });
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6">
          <div className="mx-auto bg-gray-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <LockKeyhole className="text-accent" size={36} />
          </div>
          <h1 className="text-3xl font-black italic uppercase">Restricted</h1>
          <p className="text-gray-500 font-medium text-sm">Please insert your authorized PIN code below.</p>
          <input 
            type="password"
            autoFocus
            maxLength={4}
            placeholder="****"
            className="w-full bg-gray-50 dark:bg-slate-800 rounded-xl px-6 py-4 outline-none text-center text-3xl tracking-widest font-bold focus:ring-4 focus:ring-accent/20 transition-all border-2 border-transparent focus:border-accent"
            value={passwordInput}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setPasswordInput(val);
              if (val === '1234') {
                setIsAuthenticated(true);
                toast.success('Access Granted! Welcome to Dashboard.');
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in zoom-in duration-500">
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950">
          <button 
            onClick={() => setActiveTab('publish')}
            className={`flex-1 py-6 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-sm transition-all ${activeTab === 'publish' ? 'bg-white dark:bg-slate-900 text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <PackagePlus size={18} /> Publish Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-6 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-sm transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-slate-900 text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <ListOrdered size={18} /> View Orders
          </button>
        </div>

        <div className="p-8 md:p-12">
          {activeTab === 'publish' ? (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-black italic uppercase mb-8">Add to Catalog</h2>
              <form onSubmit={handlePublish} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Product Name</label>
                    <input required placeholder="e.g. Premium Silk Panjabi" className="w-full bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Brand / Category</label>
                    <input placeholder="e.g. Zara, Next, Traditional" className="w-full bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
                  <textarea required rows={4} placeholder="Describe the quality, material, etc." className="w-full bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Original Price (৳)</label>
                    <input required type="number" placeholder="4500" className="w-full bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all" value={formData.original_price} onChange={e => setFormData({...formData, original_price: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Discount Price (৳)</label>
                    <input type="number" placeholder="3800 Optional" className="w-full bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all" value={formData.discount_price} onChange={e => setFormData({...formData, discount_price: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Image URL</label>
                    <input required type="url" placeholder="https://..." className="w-full bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Stock Quantity</label>
                    <input required type="number" min="0" className="w-full bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
                  </div>
                </div>

                <button disabled={loading} type="submit" className="w-full mt-8 bg-black dark:bg-white dark:text-black text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-accent transition-all disabled:opacity-50 uppercase tracking-widest">
                  <Upload size={18} /> {loading ? 'Publishing...' : 'Publish to Store'}
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black italic uppercase">Customer Orders</h2>
                <button onClick={fetchOrders} className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 rounded-lg transition-colors"><RefreshCw size={18} /></button>
              </div>

              {fetchingOrders ? (
                <div className="py-20 text-center font-bold text-gray-400 animate-pulse">Syncing orders securely from Supabase...</div>
              ) : orders.length === 0 ? (
                <div className="py-20 text-center font-medium text-gray-400">No orders found. Ensure orders table is configured in your database.</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                        <th className="p-4 font-bold text-xs uppercase tracking-widest text-gray-500">Order Ref</th>
                        <th className="p-4 font-bold text-xs uppercase tracking-widest text-gray-500">Identity</th>
                        <th className="p-4 font-bold text-xs uppercase tracking-widest text-gray-500">Financials</th>
                        <th className="p-4 font-bold text-xs uppercase tracking-widest text-gray-500">Routing Vector</th>
                        <th className="p-4 font-bold text-xs uppercase tracking-widest text-gray-500">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="p-4 font-mono text-xs text-accent font-bold px-4">{order.order_number}</td>
                          <td className="p-4">
                            <div className="font-bold text-sm tracking-tight">{order.customer_name}</div>
                            <div className="text-[10px] uppercase font-bold text-gray-400 mt-1">{order.payment_method}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-black text-lg">৳{order.total_price}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">{order.items?.length || 0} ITEMS LOGGED</div>
                          </td>
                          <td className="p-4 max-w-[200px]">
                            <div className="text-xs line-clamp-2 text-gray-600 dark:text-gray-300 font-medium">{order.address}, {order.area}</div>
                            <div className="text-xs font-bold text-accent mt-1 bg-accent/10 inline-block px-2 py-0.5 rounded">{order.phone}</div>
                          </td>
                          <td className="p-4 text-xs text-gray-400 font-medium">
                            {new Date(order.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
