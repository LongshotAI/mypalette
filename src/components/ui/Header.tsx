'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/ppn-logo.png" 
            alt="MyPalette by PPN" 
            width={120} 
            height={40} 
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/discover" 
            className={`text-white hover:text-gray-300 transition-colors ${
              pathname.startsWith('/discover') ? 'font-bold' : ''
            }`}
          >
            Discover Artists
          </Link>
          <Link 
            href="/open-calls" 
            className={`text-white hover:text-gray-300 transition-colors ${
              pathname.startsWith('/open-calls') ? 'font-bold' : ''
            }`}
          >
            Open Calls
          </Link>
          <Link 
            href="/education" 
            className={`text-white hover:text-gray-300 transition-colors ${
              pathname.startsWith('/education') ? 'font-bold' : ''
            }`}
          >
            Resources
          </Link>
          
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 text-white">
                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                  {user.user_metadata?.avatar_url ? (
                    <Image 
                      src={user.user_metadata.avatar_url} 
                      alt={user.user_metadata?.name || 'User'} 
                      width={32} 
                      height={32} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-sm">
                      {(user.user_metadata?.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span>Profile</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm rounded-md shadow-lg py-1 invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100">
                <Link 
                  href="/dashboard/profile" 
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                  My Profile
                </Link>
                <Link 
                  href="/dashboard/portfolios" 
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                  My Portfolios
                </Link>
                <button 
                  onClick={signOut} 
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="text-white hover:text-gray-300 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Join Free
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <Link 
              href="/discover" 
              className="block text-white hover:text-gray-300 py-2"
              onClick={closeMenu}
            >
              Discover Artists
            </Link>
            <Link 
              href="/open-calls" 
              className="block text-white hover:text-gray-300 py-2"
              onClick={closeMenu}
            >
              Open Calls
            </Link>
            <Link 
              href="/education" 
              className="block text-white hover:text-gray-300 py-2"
              onClick={closeMenu}
            >
              Resources
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/dashboard/profile" 
                  className="block text-white hover:text-gray-300 py-2"
                  onClick={closeMenu}
                >
                  My Profile
                </Link>
                <Link 
                  href="/dashboard/portfolios" 
                  className="block text-white hover:text-gray-300 py-2"
                  onClick={closeMenu}
                >
                  My Portfolios
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }} 
                  className="block w-full text-left text-white hover:text-gray-300 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link 
                  href="/auth/login" 
                  className="block text-white hover:text-gray-300 py-2"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-center"
                  onClick={closeMenu}
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
