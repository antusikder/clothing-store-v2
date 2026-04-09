import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  description: string;
  original_price: number;
  discount_price: number | null;
  image_url: string;
  stock_quantity: number;
  created_at: string;
};

export type Order = {
  id?: string;
  order_number: string;
  customer_name: string;
  phone: string;
  address: string;
  area: string;
  total_price: number;
  payment_method: string;
  status: string;
  items: unknown[];
  created_at?: string;
};
