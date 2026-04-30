UPDATE public.presentation_slides
SET bullets = '["Portal — $299 (was $499) for full self-guided platform access", "Consulting — $2,499 (was $3,499), 12 coaching sessions, Klarna available", "Ebook — $25 instant download", "Start onboarding the same day"]'::jsonb
WHERE position = 15;