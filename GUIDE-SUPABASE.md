# 🚀 GUIDE D'INSTALLATION SUPABASE POUR MARRONNER

## ✅ Étape 1 : Créer le projet Supabase

1. Va sur **https://supabase.com**
2. Clique sur "Start your project"
3. Connecte-toi (GitHub recommandé)
4. Crée un nouveau projet :
   - **Nom** : `marronner`
   - **Database Password** : Choisis un mot de passe fort et NOTE-LE !
   - **Region** : `Europe (Paris)` ou `Southeast Asia (Singapore)` (proche La Réunion)
5. Attends 2 minutes que le projet se lance

---

## 🔑 Étape 2 : Récupérer tes clés API

1. Dans ton projet Supabase, va dans **Settings** (⚙️)
2. Clique sur **API** dans le menu de gauche
3. Tu vas voir 2 valeurs importantes :

   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public** : Une longue clé qui commence par `eyJ...`

4. **IMPORTANT** : Copie ces 2 valeurs

---

## 📝 Étape 3 : Configurer le fichier JavaScript

1. Ouvre le fichier `js/supabase-config.js`
2. Remplace les 2 premières lignes :

```javascript
const SUPABASE_URL = 'https://TON-PROJET.supabase.co'; // ← Colle ton URL
const SUPABASE_ANON_KEY = 'eyJxxx...'; // ← Colle ta clé anon
```

---

## 🗄️ Étape 4 : Créer la table des profils

1. Dans Supabase, va dans **SQL Editor** (icône 📊)
2. Clique sur **New query**
3. Copie-colle TOUT le contenu du fichier `supabase-schema.sql`
4. Clique sur **Run** (ou Ctrl+Enter)
5. ✅ Tu devrais voir : "Success. No rows returned"

---

## 🔐 Étape 5 : Activer l'authentification Google (optionnel)

1. Va dans **Authentication** → **Providers**
2. Trouve **Google** et clique dessus
3. Active "Enable Google provider"
4. Suis le guide pour créer une application Google :
   - Va sur https://console.cloud.google.com
   - Crée un projet
   - Active l'API Google OAuth
   - Copie Client ID et Client Secret dans Supabase
5. Sauvegarde

**Pour Facebook** : Même process dans **Providers** → **Facebook**

---

## 🧪 Étape 6 : Tester !

1. Ouvre `index.html` dans ton navigateur
2. Clique sur "S'inscrire"
3. Clique sur "Créer un compte par email"
4. Remplis le formulaire et crée un compte
5. Vérifie ton email pour confirmer
6. Connecte-toi !

---

## 📊 Vérifier que ça marche

Dans Supabase :
- Va dans **Authentication** → **Users**
- Tu devrais voir ton utilisateur !
- Va dans **Table Editor** → **profiles**
- Tu devrais voir ton profil avec prénom, nom, type, etc.

---

## ⚠️ IMPORTANT : Sécurité

- ❌ **NE PARTAGE JAMAIS** ta clé `service_role` (celle qui commence par `eyJh...` et qui est sensible)
- ✅ La clé `anon public` peut être publique (elle est limitée par les politiques RLS)
- 🔒 Les mots de passe sont automatiquement hashés par Supabase
- ✉️ Les emails de confirmation sont envoyés automatiquement

---

## 🎨 Prochaines étapes (optionnel)

- **Tableau de bord utilisateur** : Créer `mon-compte.html`
- **Page profil marronneur** : Afficher les services d'un marronneur
- **Upload d'avatar** : Utiliser Supabase Storage
- **Chat en temps réel** : Avec Supabase Realtime

---

## 🆘 Besoin d'aide ?

Si tu as un message d'erreur :
1. Vérifie que l'URL et la clé sont bien copiées
2. Vérifie que le SQL a bien été exécuté
3. Regarde la console du navigateur (F12)
4. Dis-moi l'erreur et je t'aide !

---

🎉 **C'est parti !** Ton système d'authentification est prêt !
