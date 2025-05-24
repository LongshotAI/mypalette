import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest, context: any) {
  try {
    const id = context.params.id;
    
    // Fetch artwork by id
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Artwork fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: any) {
  try {
    const id = context.params.id;
    const body = await request.json();
    const { 
      userId, 
      title, 
      description, 
      year, 
      medium, 
      tags, 
      blockchain, 
      external_url,
      display_order
    } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify user owns this artwork
    const { data: artworkData, error: artworkError } = await supabase
      .from('artworks')
      .select('id, user_id, portfolio_id')
      .eq('id', id)
      .single();
      
    if (artworkError || !artworkData) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }
    
    if (artworkData.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Update artwork
    const { data, error } = await supabase
      .from('artworks')
      .update({
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        year: year !== undefined ? year : undefined,
        medium: medium !== undefined ? medium : undefined,
        tags: tags !== undefined ? tags : undefined,
        blockchain: blockchain !== undefined ? blockchain : undefined,
        external_url: external_url !== undefined ? external_url : undefined,
        display_order: display_order !== undefined ? display_order : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to update artwork' },
        { status: 500 }
      );
    }
    
    // Update portfolio updated_at timestamp
    await supabase
      .from('portfolios')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', artworkData.portfolio_id);
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Artwork update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const id = context.params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify user owns this artwork
    const { data: artworkData, error: artworkError } = await supabase
      .from('artworks')
      .select('id, user_id, portfolio_id')
      .eq('id', id)
      .single();
      
    if (artworkError || !artworkData) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }
    
    if (artworkData.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Delete artwork
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id);
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete artwork' },
        { status: 500 }
      );
    }
    
    // Update portfolio updated_at timestamp
    await supabase
      .from('portfolios')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', artworkData.portfolio_id);
    
    return NextResponse.json(
      { success: true, message: 'Artwork deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Artwork deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
