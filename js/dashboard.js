// Gestion du tableau de bord
console.log('📊 Dashboard chargé');

document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById('pageLoader');
  const chercheurDashboard = document.getElementById('chercheurDashboard');
  const marronneurDashboard = document.getElementById('marronneurDashboard');
  const notLoggedIn = document.getElementById('notLoggedIn');

  try {
    // Vérifier si l'utilisateur est connecté
    const user = await getCurrentUser();
    
    if (!user) {
      // Non connecté → Afficher message et rediriger
      loader.style.display = 'none';
      notLoggedIn.style.display = 'block';
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
      return;
    }

    // Récupérer le profil utilisateur
    const profileResult = await getUserProfile(user.id);
    
    if (!profileResult.success) {
      alert('Erreur lors du chargement du profil');
      loader.style.display = 'none';
      notLoggedIn.style.display = 'block';
      return;
    }

    const profile = profileResult.data;
    console.log('✅ Profil chargé:', profile);

    // Cacher le loader
    loader.style.display = 'none';

    // Afficher le bon dashboard selon le type d'utilisateur
    if (profile.user_type === 'chercheur') {
      chercheurDashboard.style.display = 'block';
      document.getElementById('chercheurName').textContent = profile.first_name + ' ' + profile.last_name;
      
      // Charger les compteurs
      await loadChercheurStats(user.id);
      
      // Charger les messages récents pour Chercheur
      await loadRecentMessages(user.id, 'recentMessages');
    } else if (profile.user_type === 'marronneur') {
      marronneurDashboard.style.display = 'block';
      document.getElementById('marronneurName').textContent = profile.first_name + ' ' + profile.last_name;
      
      // Charger les messages récents pour Marronneur
      await loadRecentMessages(user.id, 'recentMessagesMarronneur');
    } else {
      notLoggedIn.style.display = 'block';
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
    loader.style.display = 'none';
    notLoggedIn.style.display = 'block';
  }

  // Gestion de la déconnexion
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const confirmLogout = window.confirm('Es-tu sûr de vouloir te déconnecter ?');
      if (!confirmLogout) return;
      
      // Déconnexion immédiate sans animation
      await signOut();
      window.location.href = 'index.html';
    });
  }
});

// Charger les statistiques du chercheur
async function loadChercheurStats(userId) {
  try {
    // Compter les messages non lus
    const { count: unreadCount, error: messagesError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);
    
    if (!messagesError && unreadCount !== null) {
      document.getElementById('messagesCount').textContent = unreadCount;
    }
    
    // Compter les demandes (TODO: à implémenter quand la table demandes existe)
    // Pour l'instant on met 0
    document.getElementById('demandesCount').textContent = '0';
    
    // Compter les favoris (TODO: à implémenter quand la table favoris existe)
    // Pour l'instant on met 0
    document.getElementById('favorisCount').textContent = '0';
    
  } catch (error) {
    console.error('❌ Erreur chargement stats:', error);
  }
}

// Charger les messages récents
async function loadRecentMessages(userId, containerId) {
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  container.innerHTML = '<div style="text-align: center; padding: 20px; color: #9ca3af;">⏳ Chargement...</div>';
  
  try {
    // Récupérer les 3 dernières conversations avec le dernier message
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        user1:profiles!conversations_user1_id_fkey(id, first_name, last_name, user_type),
        user2:profiles!conversations_user2_id_fkey(id, first_name, last_name, user_type)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('updated_at', { ascending: false })
      .limit(3);
    
    if (error) {
      console.error('❌ Erreur chargement messages:', error);
      container.innerHTML = `
        <div style="text-align: center; padding: 30px 20px; color: #9ca3af; background: #f9fafb; border-radius: 8px;">
          <div style="font-size: 3em; margin-bottom: 10px;">📭</div>
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #6b7280;">Messagerie en préparation</p>
          <p style="margin: 0; font-size: 0.9em;">La fonctionnalité sera bientôt disponible</p>
        </div>
      `;
      return;
    }
    
    if (!conversations || conversations.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 30px 20px; color: #9ca3af; background: #f9fafb; border-radius: 8px;">
          <div style="font-size: 3em; margin-bottom: 10px;">📭</div>
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #6b7280;">Aucun message</p>
          <p style="margin: 0; font-size: 0.9em;">Vos conversations apparaîtront ici</p>
        </div>
      `;
      return;
    }
    
    // Compter les messages non lus
    const { data: unreadMessages } = await supabase
      .from('messages')
      .select('conversation_id', { count: 'exact' })
      .eq('receiver_id', userId)
      .eq('is_read', false);
    
    const unreadCounts = {};
    if (unreadMessages) {
      unreadMessages.forEach(msg => {
        unreadCounts[msg.conversation_id] = (unreadCounts[msg.conversation_id] || 0) + 1;
      });
    }
    
    // Afficher les conversations
    container.innerHTML = conversations.map(conv => {
      const otherUser = conv.user1_id === userId ? conv.user2 : conv.user1;
      const otherUserName = `${otherUser.first_name} ${otherUser.last_name}`;
      const otherUserType = otherUser.user_type === 'chercheur' ? 'Chercheur' : 'Marronneur';
      const userIcon = otherUser.user_type === 'chercheur' ? '👤' : '💼';
      
      const unreadCount = unreadCounts[conv.id] || 0;
      const unreadBadge = unreadCount > 0 ? `<span style="background: #ef4444; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75em; font-weight: 600;">${unreadCount}</span>` : '';
      
      const lastMessageDate = new Date(conv.updated_at);
      const now = new Date();
      const diffHours = Math.floor((now - lastMessageDate) / (1000 * 60 * 60));
      let timeStr = '';
      
      if (diffHours < 1) {
        timeStr = 'À l\'instant';
      } else if (diffHours < 24) {
        timeStr = `Il y a ${diffHours}h`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        timeStr = `Il y a ${diffDays}j`;
      }
      
      return `
        <div onclick="window.location.href='messagerie.html?conv=${conv.id}'" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s ease; background: ${unreadCount > 0 ? '#eff6ff' : 'white'};">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5em; flex-shrink: 0;">
              ${userIcon}
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <h4 style="margin: 0; font-size: 1em; color: var(--primary); font-weight: ${unreadCount > 0 ? '700' : '600'};">${otherUserName}</h4>
                <div style="display: flex; align-items: center; gap: 8px;">
                  ${unreadBadge}
                  <span style="font-size: 0.75em; color: #9ca3af; white-space: nowrap;">${timeStr}</span>
                </div>
              </div>
              <p style="margin: 0 0 4px 0; font-size: 0.85em; color: #6b7280;">${otherUserType}</p>
              ${conv.last_message ? `<p style="margin: 0; font-size: 0.85em; color: #9ca3af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: ${unreadCount > 0 ? '600' : '400'};">${conv.last_message}</p>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    container.innerHTML = '<div style="padding: 20px; color: #ef4444; text-align: center;">Erreur de chargement</div>';
  }
}

