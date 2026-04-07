import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWhatsAppMessage(order: {
  name: string;
  address: string;
  phone: string;
  items: { name: string; quantity: number; size?: string; price: number }[];
  total: number;
}) {
  const itemDetails = order.items
    .map((item) => `- ${item.name} (${item.size || 'N/A'}) x${item.quantity} = ৳${item.price * item.quantity}`)
    .join('\n');

  const text = `*New Order from Modern Cloth*%0A
----------------------------------%0A
*Customer:* ${order.name}%0A
*Phone:* ${order.phone}%0A
*Address:* ${order.address}%0A
----------------------------------%0A
*Items:*%0A${itemDetails}%0A
----------------------------------%0A
*Total Amount: ৳${order.total}*%0A
----------------------------------%0A
_Payment Instruction: bKash/Nagad Manual Checkout_`;

  return `https://wa.me/8801581872622?text=${text}`;
}
