import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-[120px] leading-none font-black italic tracking-tighter text-gray-200 dark:text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-bold uppercase tracking-widest mb-6">Page Under Construction</h2>
      <p className="text-gray-500 max-w-md mb-10">
        We are preparing something amazing here! The specific page you are looking for is currently under development.
      </p>
      <Link href="/" className="bg-black dark:bg-white text-white dark:text-black font-bold py-4 px-10 rounded-xl hover:bg-accent hover:text-white transition-all uppercase tracking-widest text-sm shadow-xl shadow-black/10">
        Return to Homepage
      </Link>
    </div>
  );
}
