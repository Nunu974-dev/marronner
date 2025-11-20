# Installation du système de messagerie dans Supabase

## Étapes d'installation

### 1. Accéder à Supabase SQL Editor
- Connectez-vous à votre projet Supabase : https://supabase.com/dashboard
- Allez dans la section **SQL Editor** dans le menu de gauche

### 2. Exécuter le script SQL
- Cliquez sur **New query**
- Copiez tout le contenu du fichier `supabase-messagerie.sql`
- Collez-le dans l'éditeur SQL
- Cliquez sur **Run** (ou appuyez sur Ctrl+Enter / Cmd+Enter)

### 3. Vérifier la création des tables
- Allez dans **Table Editor**
- Vous devriez voir 2 nouvelles tables :
  - `conversations` : stocke les conversations entre utilisateurs
  - `messages` : stocke les messages individuels

### 4. Structure des tables

#### Table `conversations`
```
- id (UUID, primary key)
- user1_id (UUID, foreign key vers auth.users)
- user2_id (UUID, foreign key vers auth.users)
- last_message (TEXT, dernier message pour l'aperçu)
- updated_at (TIMESTAMP, dernière activité)
- created_at (TIMESTAMP, date de création)
```

#### Table `messages`
```
- id (UUID, primary key)
- conversation_id (UUID, foreign key vers conversations)
- sender_id (UUID, foreign key vers auth.users)
- receiver_id (UUID, foreign key vers auth.users)
- content (TEXT, contenu du message)
- is_read (BOOLEAN, message lu ou non)
- created_at (TIMESTAMP, date d'envoi)
```

### 5. Fonctionnalités automatiques

Le script SQL inclut :

✅ **Row Level Security (RLS)** :
- Les utilisateurs ne voient que leurs propres conversations et messages
- Sécurité garantie au niveau de la base de données

✅ **Fonction `get_or_create_conversation`** :
- Crée une conversation si elle n'existe pas
- Évite les doublons
- Ordonne automatiquement les user_id

✅ **Trigger automatique** :
- Met à jour `updated_at` dans `conversations` quand un message est envoyé
- Permet de trier les conversations par activité récente

✅ **Index de performance** :
- Recherches rapides par utilisateur
- Chargement optimisé des messages non lus

### 6. Test de l'installation

Après l'installation, testez dans Supabase :

```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('conversations', 'messages');

-- Vérifier les politiques RLS
SELECT * FROM pg_policies 
WHERE tablename IN ('conversations', 'messages');
```

### 7. Utilisation sur le site

Une fois les tables créées, la messagerie est opérationnelle :

1. **Page messagerie** : `messagerie.html`
   - Liste des conversations
   - Interface de chat en temps réel
   - Recherche de conversations

2. **Démarrer une conversation** :
   ```javascript
   // Inclure conversation-utils.js
   <script src="js/conversation-utils.js"></script>
   
   // Utiliser la fonction
   <button onclick="startConversation('user-id-ici')">
     💬 Contacter
   </button>
   ```

3. **Exemple d'intégration** :
   - Sur une demande : bouton "Contacter le Chercheur"
   - Sur un profil Marronneur : bouton "Envoyer un message"
   - Notification de nouveaux messages dans le header

### 8. Fonctionnalités incluses

✅ Conversations en temps réel (polling toutes les 3 secondes)
✅ Messages lus/non lus
✅ Recherche dans les conversations
✅ Auto-scroll vers les nouveaux messages
✅ Envoi avec Entrée (Shift+Entrée pour nouvelle ligne)
✅ Textarea qui s'agrandit automatiquement
✅ Horodatage des messages
✅ Interface responsive et moderne

### 9. Prochaines améliorations possibles

- 🔔 Notifications push pour les nouveaux messages
- 📎 Envoi de fichiers/images
- ✏️ Édition/suppression de messages
- 👁️ Indicateur "En train d'écrire..."
- 📱 Version mobile optimisée
- 🔍 Recherche dans les messages
- 📌 Épingler des conversations importantes

## Support

Si vous rencontrez des problèmes :
1. Vérifiez que RLS est activé sur les deux tables
2. Vérifiez que les politiques sont bien créées
3. Testez les requêtes SQL dans l'éditeur Supabase
4. Consultez les logs du navigateur (F12 > Console)
