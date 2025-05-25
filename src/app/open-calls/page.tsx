'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default function OpenCallsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCalls, setOpenCalls] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch open calls
  useEffect(() => {
    const fetchOpenCalls = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('open_calls')
          .select('*')
          .eq('approved', true)
          .order('deadline', { ascending: true });
        
        if (error) throw error;
        
        setOpenCalls(data || []);
      } catch (err) {
        console.error('Error fetching open calls:', err);
        setError('Failed to load open calls');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOpenCalls();
  }, []);

  // Filter open calls based on deadline
  const filteredOpenCalls = openCalls.filter(call => {
    const deadline = new Date(call.deadline);
    const now = new Date();
    
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active' && deadline > now) return true;
    if (activeFilter === 'past' && deadline <= now) return true;
    
    return false;
  });

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-12">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50 z-10"></div>
            <Image
              src="/open-calls-hero.jpg" 
              alt="Open Calls"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="relative z-20 py-16 px-8 md:px-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Open Calls</h1>
            <p className="text-xl text-gray-300 max-w-2xl mb-6">
              Discover opportunities to showcase your work, participate in exhibitions, and connect with curators worldwide.
            </p>
            
            {user && (
              <Link 
                href="/open-calls/propose"
                className="bg-white text-black px-6 py-3 rounded-md hover:bg-gray-200 transition-colors inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Propose an Open Call
              </Link>
            )}
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex mb-8 border-b border-gray-800 pb-4">
          <button
            onClick={() => setActiveFilter('all')}
            className={`mr-6 pb-2 ${
              activeFilter === 'all' 
                ? 'text-white border-b-2 border-white font-medium' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Open Calls
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`mr-6 pb-2 ${
              activeFilter === 'active' 
                ? 'text-white border-b-2 border-white font-medium' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter('past')}
            className={`pb-2 ${
              activeFilter === 'past' 
                ? 'text-white border-b-2 border-white font-medium' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Past
          </button>
        </div>
        
        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading open calls...</p>
          </div>
        ) : filteredOpenCalls.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No open calls found</h2>
            <p className="text-gray-400 mb-6">
              {activeFilter === 'all' 
                ? 'There are currently no open calls available.' 
                : activeFilter === 'active' 
                  ? 'There are currently no active open calls.' 
                  : 'There are no past open calls.'}
            </p>
            {user && activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="bg-white text-black px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
              >
                View All Open Calls
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpenCalls.map((call) => {
              const deadline = new Date(call.deadline);
              const isExpired = deadline < new Date();
              
              return (
                <div key={call.id} className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="h-48 relative">
                    {call.banner_url ? (
                      <Image
                        src={call.banner_url}
                        alt={call.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <h3 className="text-2xl font-bold text-white px-4 text-center">{call.title}</h3>
                      </div>
                    )}
                    {isExpired && (
                      <div className="absolute top-0 right-0 bg-black/80 text-white px-3 py-1 text-sm">
                        Closed
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className={`text-sm mb-2 ${isExpired ? 'text-gray-500' : 'text-red-400'}`}>
                      {isExpired 
                        ? `Closed: ${deadline.toLocaleDateString()}` 
                        : `Deadline: ${deadline.toLocaleDateString()}`}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{call.title}</h3>
                    <p className="text-gray-300 mb-4 line-clamp-2">{call.description}</p>
                    <div className="flex justify-between items-center">
                      <Link 
                        href={`/open-calls/${call.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                      >
                        {isExpired ? 'View Details' : 'Apply Now'}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      <div className="text-sm text-gray-400">
                        {call.host_details?.organization || 'MyPalette'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
