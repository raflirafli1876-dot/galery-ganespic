-- Update bucket untuk mengizinkan semua mime types untuk development
-- PERINGATAN: Ini hanya untuk development! Untuk production, batasi mime types yang aman

UPDATE storage.buckets 
SET allowed_mime_types = NULL 
WHERE id = 'gallery';