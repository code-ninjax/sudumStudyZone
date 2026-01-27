-- Function to increment pulls
CREATE OR REPLACE FUNCTION increment_ebook_pulls(row_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE ebooks
    SET pulls = pulls + 1
    WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
