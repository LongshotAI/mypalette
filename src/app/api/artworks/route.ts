import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      userId, 
      portfolioId, 
      title, 
      description, 
      year, 
      medium, 
      tags, 
      blockchain, 
      external_url, 
      media_url, 
      media_type,
      display_order 
    } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!portfolioId || !title || !media_url || !media_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify user owns this portfolio
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolios')
      .select('user_id')
      .eq('id', portfolioId)
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
    
    // Get current max display order
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('artworks')
      .select('display_order')
      .eq('portfolio_id', portfolioId)
      .order('display_order', { ascending: false })
      .limit(1)
      .single();
      
    const newDisplayOrder = maxOrderData ? maxOrderData.display_order + 1 : 0;
    
    // Create new artwork
    const { data, error } = await supabase
      .from('artworks')
      .insert([
        {
          portfolio_id: portfolioId,
          user_id: userId,
          title,
          description: description || '',
          year: year || null,
          medium: medium || '',
          tags: tags || [],
          blockchain: blockchain || null,
          external_url: external_url || null,
          media_url,
          media_type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          display_order: display_order !== undefined ? display_order : newDisplayOrder,
        },
      ])
      .select()
      .single();
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to create artwork' },
        { status: 500 }
      );
    }
    
    // Update portfolio updated_at timestamp
    await supabase
      .from('portfolios')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', portfolioId);
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Artwork creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
