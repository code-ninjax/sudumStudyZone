import { supabase } from "./client";
import type { EBook, CreateEBookInput } from "./types";

/**
 * Get all eBooks
 */
export async function getAllEBooks(): Promise<EBook[]> {
    const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching eBooks:", error);
        return [];
    }

    return data || [];
}

/**
 * Admin: Create a new eBook
 */
export async function createEBook(ebookData: CreateEBookInput) {
    const { data, error } = await supabase
        .from("ebooks")
        .insert({
            title: ebookData.title,
            author: ebookData.author,
            category: ebookData.category,
            pages: ebookData.pages,
            cover_image_url: ebookData.cover_image_url,
            file_url: ebookData.file_url,
            description: ebookData.description,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating eBook:", error);
        throw error;
    }

    return data;
}

/**
 * Admin: Delete an eBook
 */
export async function deleteEBook(id: string) {
    const { error } = await supabase
        .from("ebooks")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting eBook:", error);
        throw error;
    }
}

/**
 * Increment pulls (downloads) for an eBook
 */
export async function incrementEBookPulls(id: string) {
    const { error } = await supabase.rpc('increment_ebook_pulls', { row_id: id });

    if (error) {
        // Fallback if RPC doesn't exist yet
        const { data: current } = await supabase.from('ebooks').select('pulls').eq('id', id).single();
        if (current) {
            await supabase.from('ebooks').update({ pulls: (current.pulls || 0) + 1 }).eq('id', id);
        }
    }
}

/**
 * Submit a rating for an eBook
 */
export async function rateEBook(id: string, rating: number) {
    const { error } = await supabase.rpc('update_ebook_rating', {
        ebook_id: id,
        new_rating: rating
    });

    if (error) {
        console.error("Error rating eBook:", error);
        throw error;
    }
}
