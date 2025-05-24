import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest, context: any) {
  try {
    const slug = context.params.slug;
    
    // Fetch portfolio by slug
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (portfolioError) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    // Fetch artworks for this portfolio
    const { data: artworks, error: artworksError } = await supabase
      .from('artworks')
      .select('*')
      .eq('portfolio_id', portfolio.id)
      .order('display_order', { ascending: true });
      
    if (artworksError) {
      return NextResponse.json(
        { error: 'Failed to fetch artworks' },
        { status: 500 }
      );
    }
    
    // Fetch user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('username, profile_image_url, bio, social_links')
      .eq('id', portfolio.user_id)
      .single();
      
    if (userError) {
      return NextResponse.json(
        { error: 'Failed to fetch user info' },
        { status: 500 }
      );
    }
    
    // Fetch template info
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', portfolio.template_id)
      .single();
      
    if (templateError) {
      return NextResponse.json(
        { error: 'Failed to fetch template info' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      portfolio,
      artworks,
      user,
      template
    }, { status: 200 });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: any) {
  try {
    const slug = context.params.slug;
    const body = await request.json();
    const { userId, name, description } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify user owns this portfolio
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolios')
      .select('id, user_id')
      .eq('slug', slug)
      .single();
      
    if (portfolioError || !portfolioData) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    if (portfolioData.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Update portfolio
    const { data, error } = await supabase
      .from('portfolios')
      .update({
        name: name || undefined,
        description: description || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', portfolioData.id)
      .select()
      .single();
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to update portfolio' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Portfolio update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const slug = context.params.slug;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify user owns this portfolio
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolios')
      .select('id, user_id')
      .eq('slug', slug)
      .single();
      
    if (portfolioError || !portfolioData) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    if (portfolioData.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Delete all artworks in this portfolio
    const { error: artworksError } = await supabase
      .from('artworks')
      .delete()
      .eq('portfolio_id', portfolioData.id);
      
    if (artworksError) {
      return NextResponse.json(
        { error: 'Failed to delete portfolio artworks' },
        { status: 500 }
      );
    }
    
    // Delete portfolio
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', portfolioData.id);
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete portfolio' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Portfolio deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Portfolio deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
