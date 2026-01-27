-- Add rating tracking columns to ebooks
ALTER TABLE public.ebooks 
ADD COLUMN IF NOT EXISTS rating_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_sum numeric DEFAULT 0;

-- Function to update ebook rating
CREATE OR REPLACE FUNCTION update_ebook_rating(ebook_id uuid, new_rating numeric)
RETURNS void AS $$
BEGIN
    UPDATE ebooks
    SET 
        rating_count = rating_count + 1,
        rating_sum = rating_sum + new_rating,
        -- Calculate new average
        rating = (rating_sum + new_rating) / (rating_count + 1),
        updated_at = now()
    WHERE id = ebook_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
