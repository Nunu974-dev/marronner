-- Vérification et correction des politiques RLS sur la table profiles
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier les politiques actuelles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 2. Activer RLS si pas déjà fait
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir tous les profils publics" ON profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leur propre profil" ON profiles;
DROP POLICY IF EXISTS "Tout le monde peut lire les profils" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 4. Créer une politique simple pour lecture (SELECT) - tout le monde peut lire
CREATE POLICY "Lecture publique des profils"
ON profiles FOR SELECT
TO authenticated, anon
USING (true);

-- 5. Créer une politique pour mise à jour (UPDATE) - seulement son propre profil
CREATE POLICY "Mise à jour de son propre profil"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 6. Créer une politique pour insertion (INSERT) - seulement son propre profil
CREATE POLICY "Insertion de son propre profil"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 7. Vérifier que les politiques sont bien créées
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'profiles';

-- 8. Tester la lecture du profil
SELECT id, email, first_name, last_name, user_type, onboarding_completed
FROM profiles
WHERE email = 'juliencw_22@hotmail.com';
