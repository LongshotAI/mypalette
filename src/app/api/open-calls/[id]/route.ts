import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest, context: any) {
  try {
    const id = context.params.id;
    
    // Fetch open call by id
    const { data: openCall, error: openCallError } = await supabase
      .from('open_calls')
      .select('*')
      .eq('id', id)
      .single();
      
    if (openCallError) {
      return NextResponse.json(
        { error: 'Open call not found' },
        { status: 404 }
      );
    }
    
    // Fetch submissions for this open call if user is the creator
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let submissions = [];
    
    if (userId && openCall.user_id === userId) {
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select(`
          *,
          users:user_id (username, profile_image_url),
          artworks:artwork_id (*)
        `)
        .eq('open_call_id', id);
        
      if (!submissionsError) {
        submissions = submissionsData;
      }
    }
    
    return NextResponse.json({
      openCall,
      submissions: userId && openCall.user_id === userId ? submissions : []
    }, { status: 200 });
  } catch (error) {
    console.error('Open call fetch error:', error);
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
    
    // Only admins can update open calls
    const { userId, is_admin } = body;
    
    if (!userId || !is_admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Verify user is an admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();
      
    if (userError || !userData || !userData.is_admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { is_approved, status } = body;
    
    // Update open call
    const { data, error } = await supabase
      .from('open_calls')
      .update({
        is_approved: is_approved !== undefined ? is_approved : undefined,
        status: status || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to update open call' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Open call update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
