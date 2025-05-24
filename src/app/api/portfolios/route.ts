import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    // Get user ID from session (in a real app, this would be from auth middleware)
    // For MVP, we'll assume the user ID is passed in the query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Fetch portfolios for the user
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch portfolios' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Portfolios fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, slug, template_id, description } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!name || !slug || !template_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if slug is already taken
    const { data: existingPortfolio, error: slugCheckError } = await supabase
      .from('portfolios')
      .select('slug')
      .eq('slug', slug)
      .single();
      
    if (existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio URL is already taken' },
        { status: 400 }
      );
    }
    
    // Create new portfolio
    const { data, error } = await supabase
      .from('portfolios')
      .insert([
        {
          user_id: userId,
          name,
          slug,
          template_id,
          description: description || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_featured: false,
          likes_count: 0,
          loves_count: 0,
        },
      ])
      .select()
      .single();
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to create portfolio' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Portfolio creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
