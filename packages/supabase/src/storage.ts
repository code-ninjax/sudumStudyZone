import { supabase } from "./client";

export const STORAGE_BUCKETS = {
  MATERIALS: "course-materials",
  EBOOKS: "ebooks",
} as const;

/**
 * Admin: Upload a file to storage
 * Note: This uses the regular client - RLS policies allow admins to upload
 */
export async function uploadMaterial(
  bucket: keyof typeof STORAGE_BUCKETS,
  filePath: string,
  file: File | Blob
) {
  const bucketName = STORAGE_BUCKETS[bucket];

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading file:", error);
    throw error;
  }

  return data;
}

/**
 * Admin: Delete a file from storage
 */
export async function deleteMaterialFile(
  bucket: keyof typeof STORAGE_BUCKETS,
  filePath: string
) {
  const bucketName = STORAGE_BUCKETS[bucket];

  const { error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);

  if (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

/**
 * Get public URL for a material file
 * Students can use this to download files
 */
export function getMaterialUrl(
  bucket: keyof typeof STORAGE_BUCKETS,
  filePath: string
): string {
  const bucketName = STORAGE_BUCKETS[bucket];
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Get signed URL for a material file (temporary access)
 * Useful for private files or time-limited access
 */
export async function getSignedUrl(
  bucket: keyof typeof STORAGE_BUCKETS,
  filePath: string,
  expiresIn: number = 3600
): Promise<string | null> {
  const bucketName = STORAGE_BUCKETS[bucket];

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    console.error("Error creating signed URL:", error);
    return null;
  }

  return data.signedUrl;
}

/**
 * Admin: List files in a storage bucket
 */
export async function listMaterialFiles(
  bucket: keyof typeof STORAGE_BUCKETS,
  path?: string
) {
  const bucketName = STORAGE_BUCKETS[bucket];

  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(path, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    console.error("Error listing files:", error);
    return [];
  }

  return data || [];
}

/**
 * Download a file as a blob
 * Students can use this to download files
 */
export async function downloadMaterial(
  bucket: keyof typeof STORAGE_BUCKETS,
  filePath: string
): Promise<Blob | null> {
  const bucketName = STORAGE_BUCKETS[bucket];

  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(filePath);

  if (error) {
    console.error("Error downloading file:", error);
    return null;
  }

  return data;
}

