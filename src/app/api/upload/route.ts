import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { userId, file, type } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // For MVP, we'll assume the file is a base64 string
    // In a production app, you would use multipart/form-data
    const fileData = file.split(',')[1];
    const fileBuffer = Buffer.from(fileData, 'base64');
    
    // Generate a unique filename
    const filename = `${userId}/${Date.now()}.${type === 'image' ? 'jpg' : 'mp4'}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('media')
      .upload(filename, fileBuffer, {
        contentType: type === 'image' ? 'image/jpeg' : 'video/mp4',
        upsert: false
      });
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('media')
      .getPublicUrl(filename);
    
    return NextResponse.json(
      { url: publicUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
