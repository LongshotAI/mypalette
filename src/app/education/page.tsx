'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default function EducationPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  // Categories
  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'digital-art', name: 'Digital Art & Portfolio Building' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'web3', name: 'Web3 Basics' },
    { id: 'ai-tools', name: 'AI Tools' },
  ];

  // Fetch educational content
  useEffect(() => {
    const fetchEducationContent = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('education_content')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setArticles(data || []);
      } catch (err) {
        console.error('Error fetching educational content:', err);
        setError('Failed to load educational resources');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEducationContent();
  }, []);

  // Filter articles by category
  const filteredArticles = articles.filter(article => {
    if (activeCategory === 'all') return true;
    return article.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-12">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50 z-10"></div>
            <Image
              src="/education-hero.jpg" 
              alt="Educational Resources"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="relative z-20 py-16 px-8 md:px-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Educational Resources</h1>
            <p className="text-xl text-gray-300 max-w-2xl mb-6">
              Learn about digital art, portfolio building, marketing strategies, and emerging technologies to advance your creative career.
            </p>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap mb-8 border-b border-gray-800 pb-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`mr-6 pb-2 mb-2 ${
                activeCategory === category.id 
                  ? 'text-white border-b-2 border-white font-medium' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
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
            <p className="text-gray-400">Loading educational resources...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No articles found</h2>
            <p className="text-gray-400 mb-6">
              {activeCategory === 'all' 
                ? 'There are currently no educational resources available.' 
                : `There are currently no articles in the ${categories.find(c => c.id === activeCategory)?.name} category.`}
            </p>
            {activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="bg-white text-black px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
              >
                View All Resources
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="h-48 relative">
                  {article.thumbnail_url ? (
                    <Image
                      src={article.thumbnail_url}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                      <h3 className="text-2xl font-bold text-white px-4 text-center">{article.title}</h3>
                    </div>
                  )}
                  <div className="absolute top-0 right-0 bg-black/80 text-white px-3 py-1 text-sm">
                    {categories.find(c => c.id === article.category)?.name || article.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{article.content.substring(0, 150)}...</p>
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/education/${article.id}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                    >
                      Read Article
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
