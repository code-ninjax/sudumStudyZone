import { supabase, supabaseAdmin } from "./client";

export const STORAGE_BUCKETS = {
  MATERIALS: "course-materials",
  EBOOKS: "ebooks",
} as const;

/**
 * Admin: Upload a file to storage
 * Uses supabaseAdmin if available to bypass storage policies
 */
export async function uploadMaterial(
  bucket: keyof typeof STORAGE_BUCKETS,
  filePath: string,
  file: File | Blob
) {
  const bucketName = STORAGE_BUCKETS[bucket];
  
  // Use supabaseAdmin if available to bypass storage policies
  const client = supabaseAdmin || supabase;

  const { data, error } = await client.storage
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
 * Uses supabaseAdmin if available to bypass storage policies
 */
export async function deleteMaterialFile(
  bucket: keyof typeof STORAGE_BUCKETS,
  filePath: string
) {
  const bucketName = STORAGE_BUCKETS[bucket];
  
  // Use supabaseAdmin if available to bypass storage policies
  const client = supabaseAdmin || supabase;

  const { error } = await client.storage
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
  bucket: keyof typeof STORAGE_BUCKETS | (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS],
  filePath: string
): string {
  // Determine if caller passed a key (e.g., 'MATERIALS') or the actual bucket name (e.g., 'course-materials')
  const bucketValue = (Object.values(STORAGE_BUCKETS) as string[]).includes(bucket as string)
    ? (bucket as typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS])
    : STORAGE_BUCKETS[bucket as keyof typeof STORAGE_BUCKETS];

  const { data } = supabase.storage
    .from(bucketValue)
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
 * Uses supabaseAdmin if available to bypass storage policies
 */
export async function listMaterialFiles(
  bucket: keyof typeof STORAGE_BUCKETS,
  path?: string
) {
  const bucketName = STORAGE_BUCKETS[bucket];
  
  // Use supabaseAdmin if available to bypass storage policies
  const client = supabaseAdmin || supabase;

  const { data, error } = await client.storage
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

