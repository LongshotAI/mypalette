'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header space - actual header is in layout */}
      <div className="h-16"></div>
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10"></div>
          <Image
            src="/hero-bg.jpg" 
            alt="Digital Art Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="container mx-auto px-4 z-20 relative">
          <div className="max-w-3xl">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              MyPalette | A Home for Your Art
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Showcase your digital art, participate in open calls, and connect with the Pixel Palette Nation community.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link 
                href="/auth/register"
                className="bg-white text-black px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Join MyPalette Free
              </Link>
              
              <Link 
                href="/discover"
                className="border border-white px-8 py-3 rounded-md text-lg font-medium hover:bg-white/10 transition-colors"
              >
                Explore Artists
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Why Join MyPalette?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <motion.div 
              className="bg-gray-800 rounded-lg p-8 hover:bg-gray-700 transition-colors"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="h-16 w-16 bg-gradient-to-r from-red-500 to-purple-500 rounded-full mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Showcase Your Art</h3>
              <p className="text-gray-300">Create beautiful portfolios to showcase your digital art. Organize your work into collections and share with the world.</p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="bg-gray-800 rounded-lg p-8 hover:bg-gray-700 transition-colors"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Apply to Open Calls</h3>
              <p className="text-gray-300">Discover and apply to open calls from galleries, exhibitions, and competitions. Get your work seen by curators worldwide.</p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="bg-gray-800 rounded-lg p-8 hover:bg-gray-700 transition-colors"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="h-16 w-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Learn & Grow</h3>
              <p className="text-gray-300">Access educational resources on digital art, portfolio building, marketing, and emerging technologies like AI and Web3.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Open Calls Preview */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Open Calls</h2>
            <Link 
              href="/open-calls"
              className="text-white hover:text-gray-300 transition-colors flex items-center"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Open Call Card 1 */}
            <motion.div 
              className="bg-gray-800 rounded-lg overflow-hidden"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="h-48 relative">
                <Image
                  src="/open-call-1.jpg"
                  alt="Digital Art Open Call"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-red-400 mb-2">Deadline: June 15, 2025</div>
                <h3 className="text-xl font-bold mb-2">Digital Dreamscapes Exhibition</h3>
                <p className="text-gray-300 mb-4">Submit your digital art exploring themes of dreams, consciousness, and surrealism.</p>
                <Link 
                  href="/open-calls/digital-dreamscapes"
                  className="text-white hover:text-gray-300 transition-colors flex items-center text-sm font-medium"
                >
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </motion.div>
            
            {/* Open Call Card 2 */}
            <motion.div 
              className="bg-gray-800 rounded-lg overflow-hidden"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="h-48 relative">
                <Image
                  src="/open-call-2.jpg"
                  alt="AI Art Challenge"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-red-400 mb-2">Deadline: July 1, 2025</div>
                <h3 className="text-xl font-bold mb-2">AI Art Innovation Challenge</h3>
                <p className="text-gray-300 mb-4">Showcase your innovative approaches to AI-assisted art creation and human-AI collaboration.</p>
                <Link 
                  href="/open-calls/ai-innovation"
                  className="text-white hover:text-gray-300 transition-colors flex items-center text-sm font-medium"
                >
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </motion.div>
            
            {/* Open Call Card 3 */}
            <motion.div 
              className="bg-gray-800 rounded-lg overflow-hidden"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="h-48 relative">
                <Image
                  src="/open-call-3.jpg"
                  alt="Emerging Artists Showcase"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-red-400 mb-2">Deadline: July 30, 2025</div>
                <h3 className="text-xl font-bold mb-2">Emerging Digital Artists Showcase</h3>
                <p className="text-gray-300 mb-4">Special opportunity for emerging artists to showcase their work and gain visibility in the digital art community.</p>
                <Link 
                  href="/open-calls/emerging-artists"
                  className="text-white hover:text-gray-300 transition-colors flex items-center text-sm font-medium"
                >
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to Join the Pixel Palette Nation?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Create your free account today and start showcasing your digital art to the world.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/auth/register"
              className="bg-white text-black px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Get Started for Free
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image 
                src="/ppn-logo.png" 
                alt="MyPalette by PPN" 
                width={150} 
                height={50} 
                className="mb-4"
              />
              <p className="text-gray-400">A platform for digital artists to showcase their work and participate in open calls.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Explore</h3>
              <ul className="space-y-2">
                <li><Link href="/discover" className="text-gray-400 hover:text-white transition-colors">Discover Artists</Link></li>
                <li><Link href="/open-calls" className="text-gray-400 hover:text-white transition-colors">Open Calls</Link></li>
                <li><Link href="/education" className="text-gray-400 hover:text-white transition-colors">Resources</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">Join Free</Link></li>
                <li><Link href="/dashboard/profile" className="text-gray-400 hover:text-white transition-colors">My Profile</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="https://pixelpalettenation.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">PPN Website</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Pixel Palette Nation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
