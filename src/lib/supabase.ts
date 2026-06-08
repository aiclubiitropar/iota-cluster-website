import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImageToStorage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Failed to upload image:", error);
    return null;
  }
}

export async function uploadFileToStorage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  try {
    const fileExt = file.name.split('.').pop();
    // Keep original filename but sanitize it to avoid storage issues
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 50);
    const fileName = `${Date.now()}_${sanitizedName}`;
    const filePath = `files/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images') // We use images bucket for simplicity, or "resources" if they made one
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Failed to upload file:", error);
    return null;
  }
}
