'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-gray-400 mb-8">The page you are looking for does not exist.</p>
      <Link href="/">
        <button className="bg-green-500 hover:bg-green-600 text-gray-900 font-bold py-3 px-6 rounded-lg">
          Go Back Home
        </button>
      </Link>
    </div>
  );
}