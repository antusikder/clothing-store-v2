import Link from 'next/link';
import { Mail, Instagram, Facebook, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tighter">MODERN<span className="text-accent">CLOTH</span></h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium quality clothes designed for the modern individual. Experience comfort and style like never before.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Featured Collection</Link></li>
              <li><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a href="mailto:antualmansikder3.1415@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail size={16} /> antualmansikder3.1415@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+8801581872622" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone size={16} /> +880 1581 872 622
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-accent transition-colors"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-accent transition-colors"><Instagram size={18} /></a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Modern Cloth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
