'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { user, loading } = useAuth();
  const [featuredPortfolios, setFeaturedPortfolios] = useState([]);
  
  useEffect(() => {
    // In a real implementation, this would fetch featured portfolios from the API
    // For now, we'll use placeholder data
    setFeaturedPortfolios([
      { id: '1', name: 'Abstract Collection', artist: 'Jane Doe', image: '/placeholder-portfolio-1.jpg' },
      { id: '2', name: 'Urban Landscapes', artist: 'John Smith', image: '/placeholder-portfolio-2.jpg' },
      { id: '3', name: 'Digital Dreams', artist: 'Alex Johnson', image: '/placeholder-portfolio-3.jpg' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to MyPalette</h1>
              <p className="text-xl mb-8">The platform for artists to showcase their work and connect with opportunities.</p>
              
              {!loading && (
                user ? (
                  <Link href="/dashboard/profile" className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
                    Go to Dashboard
                  </Link>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/auth/login" className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
                      Log In
                    </Link>
                    <Link href="/auth/register" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-indigo-700 transition">
                      Sign Up
                    </Link>
                  </div>
                )
              )}
            </div>
            <div className="md:w-1/2">
              <div className="relative h-64 md:h-96 w-full">
                {/* Placeholder for hero image */}
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                  <p className="text-xl font-medium">Artist Showcase Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Featured Portfolios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPortfolios.map((portfolio) => (
              <div key={portfolio.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {/* Placeholder for portfolio image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-600">Portfolio Preview</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{portfolio.name}</h3>
                  <p className="text-gray-600 mb-4">By {portfolio.artist}</p>
                  <Link href={`/portfolio/${portfolio.id}`} className="text-indigo-600 font-medium hover:text-indigo-800">
                    View Portfolio →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Calls Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Current Open Calls</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-2">Digital Art Exhibition 2025</h3>
            <p className="text-gray-600 mb-4">Submit your digital artwork for our upcoming online exhibition.</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Deadline: August 15, 2025</span>
              <Link href="/open-calls/digital-art" className="text-indigo-600 font-medium hover:text-indigo-800">
                Learn More →
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Emerging Artists Showcase</h3>
            <p className="text-gray-600 mb-4">An opportunity for new artists to gain visibility and recognition.</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Deadline: September 30, 2025</span>
              <Link href="/open-calls/emerging-artists" className="text-indigo-600 font-medium hover:text-indigo-800">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Educational Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Portfolio Best Practices</h3>
              <p className="text-gray-600 mb-4">Learn how to create a compelling artist portfolio that showcases your work effectively.</p>
              <Link href="/education/portfolio-best-practices" className="text-indigo-600 font-medium hover:text-indigo-800">
                Read Article →
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Digital Rights for Artists</h3>
              <p className="text-gray-600 mb-4">Understanding copyright, licensing, and protecting your work in the digital age.</p>
              <Link href="/education/digital-rights" className="text-indigo-600 font-medium hover:text-indigo-800">
                Read Article →
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Marketing Your Art Online</h3>
              <p className="text-gray-600 mb-4">Strategies for promoting your artwork and building an audience on social media.</p>
              <Link href="/education/marketing-art-online" className="text-indigo-600 font-medium hover:text-indigo-800">
                Read Article →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">MyPalette</h3>
              <p className="text-gray-400 max-w-md">The platform for artists to showcase their work and connect with opportunities.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Platform</h4>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                  <li><Link href="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                  <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><Link href="/education" className="text-gray-400 hover:text-white">Education</Link></li>
                  <li><Link href="/open-calls" className="text-gray-400 hover:text-white">Open Calls</Link></li>
                  <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                  <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
                  <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© 2025 MyPalette. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
