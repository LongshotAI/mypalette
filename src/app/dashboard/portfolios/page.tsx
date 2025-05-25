'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

// Form validation schema
const portfolioSchema = z.object({
  name: z.string().min(3, 'Portfolio name must be at least 3 characters').max(50, 'Portfolio name cannot exceed 50 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters'),
  slug: z.string().min(3, 'URL slug must be at least 3 characters').max(30, 'URL slug cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'URL slug can only contain letters, numbers, and hyphens'),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

export default function PortfoliosPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
    },
  });

  // Fetch user portfolios
  useEffect(() => {
    if (!user) return;
    
    const fetchPortfolios = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setPortfolios(data || []);
      } catch (err) {
        console.error('Error fetching portfolios:', err);
        setError('Failed to load portfolios');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPortfolios();
  }, [user]);

  const onSubmit = async (data: PortfolioFormValues) => {
    if (!user) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Check if slug is already taken
      const { data: existingPortfolio, error: checkError } = await supabase
        .from('portfolios')
        .select('id')
        .eq('slug', data.slug)
        .single();
      
      if (existingPortfolio) {
        setError('This URL slug is already taken. Please choose another one.');
        setIsSaving(false);
        return;
      }
      
      const { data: newPortfolio, error } = await supabase
        .from('portfolios')
        .insert({
          user_id: user.id,
          name: data.name,
          description: data.description,
          slug: data.slug,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setPortfolios([newPortfolio, ...portfolios]);
      setSuccess('Portfolio created successfully');
      setIsCreating(false);
      reset();
    } catch (err) {
      console.error('Error creating portfolio:', err);
      setError('Failed to create portfolio');
    } finally {
      setIsSaving(false);
    }
  };

  const deletePortfolio = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPortfolios(portfolios.filter(portfolio => portfolio.id !== id));
      setSuccess('Portfolio deleted successfully');
    } catch (err) {
      console.error('Error deleting portfolio:', err);
      setError('Failed to delete portfolio');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Please sign in to access your portfolios</p>
          <Link 
            href="/auth/login"
            className="bg-white text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Portfolios</h1>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              {isCreating ? 'Cancel' : 'Create New Portfolio'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md mb-6">
              {success}
            </div>
          )}
          
          {isCreating && (
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Create New Portfolio</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Portfolio Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="My Awesome Portfolio"
                    disabled={isSaving}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="A collection of my best digital artwork..."
                    disabled={isSaving}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
                    URL Slug
                  </label>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-3 py-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-700 text-gray-400">
                      mypalette.com/portfolio/
                    </span>
                    <input
                      id="slug"
                      type="text"
                      {...register('slug')}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="my-awesome-portfolio"
                      disabled={isSaving}
                    />
                  </div>
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    This will be the URL for your portfolio. Use only letters, numbers, and hyphens.
                  </p>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-white text-black py-3 rounded-md font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Creating...' : 'Create Portfolio'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading your portfolios...</p>
            </div>
          ) : portfolios.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">You don't have any portfolios yet</h2>
              <p className="text-gray-400 mb-6">
                Create your first portfolio to showcase your artwork to the world.
              </p>
              {!isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-white text-black px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Create Your First Portfolio
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolios.map((portfolio) => (
                <div key={portfolio.id} className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2">{portfolio.name}</h2>
                    <p className="text-gray-400 mb-4 line-clamp-2">{portfolio.description}</p>
                    <div className="flex justify-between items-center">
                      <Link 
                        href={`/portfolio/${portfolio.slug}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                      >
                        View Portfolio
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      <div className="flex space-x-2">
                        <Link 
                          href={`/dashboard/portfolios/${portfolio.id}/edit`}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Link>
                        <button 
                          onClick={() => deletePortfolio(portfolio.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
