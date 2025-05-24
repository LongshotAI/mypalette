'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormValues } from '@/lib/validations';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import ProfileImageUploader from '@/components/ProfileImageUploader';

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
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
      social_links: {
        twitter: '',
        instagram: '',
        linkedin: '',
        website: '',
      },
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        bio: user.bio || '',
        social_links: {
          twitter: user.social_links?.twitter || '',
          instagram: user.social_links?.instagram || '',
          linkedin: user.social_links?.linkedin || '',
          website: user.social_links?.website || '',
        },
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch(`/api/users/${user.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: user.id,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || 'Failed to update profile');
        return;
      }
      
      setSuccess(true);
      
      // Reset form with updated values
      reset({
        username: result.username,
        bio: result.bio || '',
        social_links: {
          twitter: result.social_links?.twitter || '',
          instagram: result.social_links?.instagram || '',
          linkedin: result.social_links?.linkedin || '',
          website: result.social_links?.website || '',
        },
      });
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-6">
        <p>Please sign in to edit your profile.</p>
        <button
          onClick={() => router.push('/auth/login')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      {/* Add Profile Image Uploader */}
      <div className="mb-8">
        <ProfileImageUploader />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Profile updated successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={true} // Username cannot be changed after registration
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Username cannot be changed after registration.</p>
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              {...register('bio')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Maximum 280 characters.</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Links</h3>
            
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                id="twitter"
                type="url"
                {...register('social_links.twitter')}
                placeholder="https://twitter.com/yourusername"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {errors.social_links?.twitter && (
                <p className="mt-1 text-sm text-red-600">{errors.social_links.twitter.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                id="instagram"
                type="url"
                {...register('social_links.instagram')}
                placeholder="https://instagram.com/yourusername"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {errors.social_links?.instagram && (
                <p className="mt-1 text-sm text-red-600">{errors.social_links.instagram.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                id="linkedin"
                type="url"
                {...register('social_links.linkedin')}
                placeholder="https://linkedin.com/in/yourusername"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {errors.social_links?.linkedin && (
                <p className="mt-1 text-sm text-red-600">{errors.social_links.linkedin.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Personal Website
              </label>
              <input
                id="website"
                type="url"
                {...register('social_links.website')}
                placeholder="https://yourwebsite.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {errors.social_links?.website && (
                <p className="mt-1 text-sm text-red-600">{errors.social_links.website.message}</p>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
