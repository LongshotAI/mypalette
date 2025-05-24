import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest, context: any) {
  try {
    const username = context.params.username;
    
    // Fetch user by username
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, username, email, bio, profile_image_url, social_links, created_at')
      .eq('username', username)
      .single();
      
    if (userError) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // No need to remove password_hash as it's not included in the select
    const user = userData;
    
    // Fetch user's featured portfolios
    const { data: portfolios, error: portfoliosError } = await supabase
      .from('portfolios')
      .select('id, name, slug, description, template_id, created_at, updated_at, is_featured')
      .eq('user_id', user.id)
      .eq('is_featured', true)
      .order('updated_at', { ascending: false });
      
    if (portfoliosError) {
      return NextResponse.json(
        { error: 'Failed to fetch portfolios' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      user,
      portfolios: portfolios || []
    }, { status: 200 });
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
