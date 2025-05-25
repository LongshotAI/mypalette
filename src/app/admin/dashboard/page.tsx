'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openCallRequests, setOpenCallRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('open-calls');

  // Check if user is admin
  useEffect(() => {
    if (!user) return;
    
    const checkAdminStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setIsAdmin(data?.is_admin || false);
        
        if (!data?.is_admin) {
          setError('You do not have permission to access this page');
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to verify admin permissions');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  // Fetch open call requests
  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchOpenCallRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('open_calls')
          .select('*, users(username, profile_image)')
          .eq('approved', false)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setOpenCallRequests(data || []);
      } catch (err) {
        console.error('Error fetching open call requests:', err);
      }
    };
    
    if (activeTab === 'open-calls') {
      fetchOpenCallRequests();
    }
  }, [isAdmin, activeTab]);

  const approveOpenCall = async (id: string) => {
    try {
      const { error } = await supabase
        .from('open_calls')
        .update({ approved: true })
        .eq('id', id);
      
      if (error) throw error;
      
      setOpenCallRequests(openCallRequests.filter(request => request.id !== id));
    } catch (err) {
      console.error('Error approving open call:', err);
      setError('Failed to approve open call');
    }
  };

  const rejectOpenCall = async (id: string) => {
    if (!confirm('Are you sure you want to reject this open call request? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('open_calls')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setOpenCallRequests(openCallRequests.filter(request => request.id !== id));
    } catch (err) {
      console.error('Error rejecting open call:', err);
      setError('Failed to reject open call');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Please sign in to access the admin dashboard</p>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">You do not have permission to access the admin dashboard.</p>
          <Link 
            href="/"
            className="bg-white text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-8">
          <button
            onClick={() => setActiveTab('open-calls')}
            className={`pb-4 px-6 ${
              activeTab === 'open-calls' 
                ? 'text-white border-b-2 border-white font-medium' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Open Call Requests
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-6 ${
              activeTab === 'users' 
                ? 'text-white border-b-2 border-white font-medium' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-4 px-6 ${
              activeTab === 'content' 
                ? 'text-white border-b-2 border-white font-medium' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Content Management
          </button>
        </div>
        
        {/* Open Call Requests Tab */}
        {activeTab === 'open-calls' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Open Call Requests</h2>
            
            {openCallRequests.length === 0 ? (
              <div className="bg-gray-900 rounded-lg p-8 text-center">
                <p className="text-gray-400">There are no pending open call requests.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {openCallRequests.map((request) => (
                  <div key={request.id} className="bg-gray-900 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{request.title}</h3>
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 mr-2">
                            {request.users?.profile_image ? (
                              <Image 
                                src={request.users.profile_image} 
                                alt={request.users.username || 'User'} 
                                width={32} 
                                height={32} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white text-sm">
                                {(request.users?.username || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="text-gray-400">Submitted by {request.users?.username || 'Unknown User'}</span>
                        </div>
                        <p className="text-gray-300 mb-4">{request.description}</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-gray-400 block text-sm">Deadline</span>
                            <span>{new Date(request.deadline).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-sm">Organization</span>
                            <span>{request.host_details?.organization || 'Not specified'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => approveOpenCall(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectOpenCall(request.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">User Management</h2>
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <p className="text-gray-400">User management functionality will be implemented in the next phase.</p>
            </div>
          </div>
        )}
        
        {/* Content Management Tab */}
        {activeTab === 'content' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Content Management</h2>
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <p className="text-gray-400">Content management functionality will be implemented in the next phase.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
