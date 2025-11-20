# Marronner 🇷🇪

Plateforme de mise en relation entre chercheurs et freelances à La Réunion.

## 🚀 Fonctionnalités

- ✅ Authentification avec Supabase (email/password + Google)
- ✅ Publication de demandes
- ✅ Messagerie en temps réel
- ✅ Système de propositions
- ✅ Profils de marronneurs
- ✅ Tableau de bord personnalisé

## 🛠️ Technologies

- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **Backend** : Supabase (PostgreSQL + Auth + Realtime)
- **Hébergement** : Hostinger
- **Déploiement** : GitHub + Webhook automatique

## 📦 Déploiement

Le site se déploie automatiquement à chaque `git push` sur la branche `main` grâce au webhook GitHub → Hostinger.

## 🔧 Développement local

```bash
# Cloner le repository
git clone https://github.com/Monticketpromo/marronner.git

# Naviguer dans le dossier
cd marronner

# Lancer le serveur local
python3 -m http.server 8000
```

Puis ouvrir : http://localhost:8000

## 📝 Structure du projet

```
marronner/
├── index.html              # Page d'accueil
├── inscription.html        # Inscription
├── connexion.html          # Connexion
├── tableau-de-bord.html    # Dashboard utilisateur
├── publier-demande.html    # Publication de demandes
├── voir-propositions.html  # Visualisation des propositions
├── profil-marronneur.html  # Profil public des marronneurs
├── messagerie.html         # Messagerie
├── css/
│   └── style.css          # Styles globaux
├── js/
│   ├── auth.js            # Gestion authentification
│   ├── supabase-config.js # Configuration Supabase
│   ├── dashboard.js       # Logique du dashboard
│   ├── messagerie.js      # Système de messagerie
│   └── ...
└── img/
    └── logo.jpg
```

## 🗄️ Base de données

Les schémas Supabase sont dans :
- `supabase-schema.sql` - Tables utilisateurs et demandes
- `supabase-messagerie.sql` - Tables conversations et messages

## 📄 Licence

© 2025 Marronner - Fait avec ❤️ à La Réunion
# Test webhook
