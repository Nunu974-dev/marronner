-- Script de diagnostic et correction du profil
-- À exécuter dans Supabase SQL Editor

-- 1. DIAGNOSTIC: Vérifier ton profil actuel
SELECT 
  id, 
  email, 
  first_name, 
  last_name, 
  user_type,
  onboarding_completed,
  categories,
  bio,
  experience,
  competences,
  services,
  created_at,
  updated_at
FROM profiles 
WHERE email = 'juliencw_22@hotmail.com';

-- 2. Si onboarding_completed est NULL ou FALSE alors que tu as bien complété ton profil:
UPDATE profiles 
SET onboarding_completed = true,
    updated_at = NOW()
WHERE email = 'juliencw_22@hotmail.com' 
  AND user_type = 'marronneur';

-- 3. Vérification après correction
SELECT 
  id, 
  email, 
  first_name, 
  last_name, 
  user_type,
  onboarding_completed,
  bio IS NOT NULL as has_bio,
  categories IS NOT NULL as has_categories,
  competences IS NOT NULL as has_competences
FROM profiles 
WHERE email = 'juliencw_22@hotmail.com';
