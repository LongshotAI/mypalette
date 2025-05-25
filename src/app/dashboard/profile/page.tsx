'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { ProfileImageUploader } from '@/components/ProfileImageUploader';

// Form validation schema
const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  bio: z.string().max(280, 'Bio cannot exceed 280 characters'),
  website: z.string().url('Please enter a valid URL').or(z.string().length(0)),
  twitter: z.string().max(50, 'Twitter handle is too long'),
  instagram: z.string().max(50, 'Instagram handle is too long'),
  linkedin: z.string().max(50, 'LinkedIn handle is too long'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      bio: '',
      website: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
  });

  // Fetch user profile data
  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          reset({
            username: data.username || '',
            bio: data.bio || '',
            website: data.social_links?.website || '',
            twitter: data.social_links?.twitter || '',
            instagram: data.social_links?.instagram || '',
            linkedin: data.social_links?.linkedin || '',
          });
          
          setProfileImage(data.profile_image || null);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          username: data.username,
          bio: data.bio,
          profile_image: profileImage,
          social_links: {
            website: data.website,
            twitter: data.twitter,
            instagram: data.instagram,
            linkedin: data.linkedin,
          },
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setProfileImage(url);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Please sign in to access your profile</p>
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
          
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
          
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3">
                <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <div className="mb-4 relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-700">
                    {profileImage ? (
                      <Image 
                        src={profileImage} 
                        alt="Profile" 
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  
                  <ProfileImageUploader onUpload={handleImageUpload} />
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      {...register('username')}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your_username"
                      disabled={isLoading || isSaving}
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                      Bio <span className="text-gray-500">(max 280 characters)</span>
                    </label>
                    <textarea
                      id="bio"
                      {...register('bio')}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself and your art..."
                      disabled={isLoading || isSaving}
                    />
                    {errors.bio && (
                      <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Social Links</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
                          Website
                        </label>
                        <input
                          id="website"
                          type="text"
                          {...register('website')}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://yourwebsite.com"
                          disabled={isLoading || isSaving}
                        />
                        {errors.website && (
                          <p className="mt-1 text-sm text-red-500">{errors.website.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="twitter" className="block text-sm font-medium text-gray-300 mb-1">
                          Twitter
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 py-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-700 text-gray-400">
                            @
                          </span>
                          <input
                            id="twitter"
                            type="text"
                            {...register('twitter')}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="username"
                            disabled={isLoading || isSaving}
                          />
                        </div>
                        {errors.twitter && (
                          <p className="mt-1 text-sm text-red-500">{errors.twitter.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-300 mb-1">
                          Instagram
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 py-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-700 text-gray-400">
                            @
                          </span>
                          <input
                            id="instagram"
                            type="text"
                            {...register('instagram')}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="username"
                            disabled={isLoading || isSaving}
                          />
                        </div>
                        {errors.instagram && (
                          <p className="mt-1 text-sm text-red-500">{errors.instagram.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-1">
                          LinkedIn
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 py-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-700 text-gray-400">
                            linkedin.com/in/
                          </span>
                          <input
                            id="linkedin"
                            type="text"
                            {...register('linkedin')}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="username"
                            disabled={isLoading || isSaving}
                          />
                        </div>
                        {errors.linkedin && (
                          <p className="mt-1 text-sm text-red-500">{errors.linkedin.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading || isSaving}
                      className="w-full bg-white text-black py-3 rounded-md font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
