-- Admin Promotion SQL
-- Run this in your Supabase SQL Editor

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'kkyydd2@naver.com';

-- Verify the change
SELECT * FROM public.profiles WHERE email = 'kkyydd2@naver.com';
