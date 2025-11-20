# Installation de la Messagerie - Marronner

## 📋 Étapes pour activer la messagerie

### 1️⃣ Se connecter à Supabase
1. Allez sur https://supabase.com
2. Connectez-vous avec votre compte
3. Sélectionnez votre projet **Marronner**

### 2️⃣ Créer les tables de messagerie

1. Dans le menu de gauche, cliquez sur **SQL Editor**
2. Cliquez sur **New query**
3. Copiez-collez tout le contenu du fichier `supabase-messagerie.sql`
4. Cliquez sur **Run** (bouton en bas à droite)
5. Attendez que toutes les commandes s'exécutent (vous devriez voir "Success" en vert)

### 3️⃣ Vérifier que tout fonctionne

1. Dans le menu de gauche, cliquez sur **Table Editor**
2. Vous devriez voir 2 nouvelles tables :
   - ✅ `conversations`
   - ✅ `messages`

3. Cliquez sur chaque table pour vérifier les colonnes :

**Table `conversations`** :
- id (UUID)
- user1_id (UUID)
- user2_id (UUID)
- last_message (text)
- updated_at (timestamp)
- created_at (timestamp)

**Table `messages`** :
- id (UUID)
- conversation_id (UUID)
- sender_id (UUID)
- receiver_id (UUID)
- content (text)
- is_read (boolean)
- created_at (timestamp)

### 4️⃣ Tester sur le site

1. Retournez sur http://localhost:8000
2. Actualisez la page (F5)
3. Allez dans votre **Tableau de bord**
4. La section **Messages récents** devrait maintenant afficher "Aucun message" au lieu d'une erreur
5. Cliquez sur la bulle de message en bas à droite - elle devrait s'ouvrir sans erreur

### 5️⃣ Test complet (optionnel)

Pour tester complètement la messagerie :

1. Créez deux comptes utilisateurs (un Chercheur et un Marronneur)
2. Connectez-vous avec le premier compte
3. Allez dans **Messagerie** dans le pied de page
4. Déconnectez-vous et connectez-vous avec le deuxième compte
5. Essayez d'envoyer un message (quand la fonction "Contacter" sera implémentée)

---

## ❓ Problèmes courants

### "Erreur de chargement" dans le dashboard
➡️ Les tables n'ont pas encore été créées dans Supabase. Suivez l'étape 2.

### "relation does not exist"
➡️ Le SQL n'a pas été exécuté correctement. Vérifiez qu'il n'y a pas d'erreurs dans le SQL Editor.

### "permission denied"
➡️ Les politiques RLS ne sont pas activées. Relancez tout le script SQL.

---

## 📝 Notes importantes

- ⚠️ N'oubliez pas d'exécuter **TOUT** le fichier `supabase-messagerie.sql` en une seule fois
- ✅ Les politiques de sécurité (RLS) sont automatiquement activées
- 🔒 Seuls les utilisateurs impliqués dans une conversation peuvent voir les messages
- 🔄 Le timestamp des conversations se met à jour automatiquement quand un nouveau message arrive

---

## 🎉 C'est prêt !

Une fois les tables créées, tout devrait fonctionner :
- ✅ Widget de message flottant
- ✅ Badge avec nombre de messages non lus
- ✅ Section "Messages récents" dans le dashboard
- ✅ Page messagerie complète
- ✅ Mise à jour en temps réel (toutes les 3 secondes)
