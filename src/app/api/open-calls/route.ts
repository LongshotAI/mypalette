import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    // Fetch all open calls
    const { data, error } = await supabase
      .from('open_calls')
      .select('*')
      .eq('status', 'active')
      .order('submission_deadline', { ascending: true });
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch open calls' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Open calls fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      userId, 
      title, 
      description, 
      organization_name, 
      organization_links, 
      banner_image_url, 
      submission_deadline,
      field_requirements 
    } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!title || !description || !organization_name || !submission_deadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new open call application (pending approval)
    const { data, error } = await supabase
      .from('open_calls')
      .insert([
        {
          user_id: userId,
          title,
          description,
          organization_name,
          organization_links: organization_links || {},
          banner_image_url: banner_image_url || '',
          submission_deadline,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_approved: false,
          field_requirements: field_requirements || {},
          status: 'pending_approval',
        },
      ])
      .select()
      .single();
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to create open call application' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Open call creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
