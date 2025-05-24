import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest, context: any) {
  try {
    const id = context.params.id;
    const body = await request.json();
    const { 
      userId, 
      artwork_id, 
      media_url, 
      bio, 
      responses 
    } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!bio) {
      return NextResponse.json(
        { error: 'Bio is required' },
        { status: 400 }
      );
    }
    
    if (!artwork_id && !media_url) {
      return NextResponse.json(
        { error: 'Either artwork_id or media_url is required' },
        { status: 400 }
      );
    }
    
    // Verify open call exists and is active
    const { data: openCallData, error: openCallError } = await supabase
      .from('open_calls')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single();
      
    if (openCallError || !openCallData) {
      return NextResponse.json(
        { error: 'Open call not found or not active' },
        { status: 404 }
      );
    }
    
    // Check if user has already submitted to this open call
    const { data: existingSubmissions, error: submissionCheckError } = await supabase
      .from('submissions')
      .select('id')
      .eq('open_call_id', id)
      .eq('user_id', userId);
      
    // Determine if this is the first submission (free) or a paid submission
    const isFirstSubmission = !existingSubmissions || existingSubmissions.length === 0;
    const requiresPayment = !isFirstSubmission && existingSubmissions.length < 6;
    const exceedsLimit = !isFirstSubmission && existingSubmissions.length >= 6;
    
    if (exceedsLimit) {
      return NextResponse.json(
        { error: 'You have reached the maximum number of submissions (6) for this open call' },
        { status: 400 }
      );
    }
    
    let payment_id = null;
    
    if (requiresPayment) {
      // In a real implementation, we would process payment with Stripe here
      // For MVP, we'll just simulate payment
      payment_id = `payment_${Date.now()}`;
    }
    
    // Create submission
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        {
          open_call_id: id,
          user_id: userId,
          artwork_id: artwork_id || null,
          media_url: media_url || null,
          bio,
          responses: responses || {},
          created_at: new Date().toISOString(),
          is_selected: false,
          payment_id,
        },
      ])
      .select()
      .single();
      
    if (error) {
      return NextResponse.json(
        { error: 'Failed to create submission' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      ...data,
      isFirstSubmission,
      requiresPayment
    }, { status: 201 });
  } catch (error) {
    console.error('Submission creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
