import { supabase } from '@/lib/supabase';

// Helper function to upload file to Supabase Storage
export const uploadFile = async (
  file: File,
  bucket: string,
  path: string
): Promise<{ url: string | null; error: Error | null }> => {
  try {
    // Create a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { url: null, error: error as Error };
  }
};

// Helper function to delete file from Supabase Storage
export const deleteFile = async (
  bucket: string,
  path: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error as Error };
  }
};

// Helper function to list files in a directory
export const listFiles = async (
  bucket: string,
  path: string
): Promise<{ files: string[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);

    if (error) throw error;

    const files = data.map(file => file.name);
    return { files, error: null };
  } catch (error) {
    console.error('Error listing files:', error);
    return { files: null, error: error as Error };
  }
};
