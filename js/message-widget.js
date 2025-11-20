// Widget de messagerie flottant
console.log('💬 Widget messagerie chargé');

let messageWidgetInterval = null;
let currentUserId = null;

// Initialiser le widget au chargement
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Pas connecté, pas de widget
    return;
  }
  
  currentUserId = session.user.id;
  
  // Créer le widget
  createMessageWidget();
  
  // Charger les messages non lus
  await updateUnreadCount();
  
  // Mettre à jour toutes les 10 secondes
  messageWidgetInterval = setInterval(updateUnreadCount, 10000);
})();

// Créer le widget HTML
function createMessageWidget() {
  const widget = document.createElement('div');
  widget.id = 'messageWidget';
  widget.innerHTML = `
    <div id="messageWidgetButton" style="
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      border-radius: 50%;
      box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: all 0.3s ease;
    ">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span id="unreadBadge" style="
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ef4444;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 0.75em;
        font-weight: 700;
        border: 3px solid white;
      ">0</span>
    </div>
    
    <div id="messageWidgetPanel" style="
      position: fixed;
      bottom: 100px;
      right: 30px;
      width: 380px;
      max-height: 500px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      z-index: 9998;
      display: none;
      flex-direction: column;
      overflow: hidden;
    ">
      <div style="
        background: linear-gradient(135deg, #2563eb, #3b82f6);
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <h3 style="margin: 0; font-size: 1.1em;">💬 Messages</h3>
        <button id="closeWidgetBtn" style="
          background: transparent;
          border: none;
          color: white;
          font-size: 1.5em;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.2s;
        ">×</button>
      </div>
      
      <div id="widgetConversationsList" style="
        flex: 1;
        overflow-y: auto;
        max-height: 380px;
      ">
        <div style="text-align: center; padding: 40px 20px; color: #9ca3af;">
          ⏳ Chargement...
        </div>
      </div>
      
      <div style="
        padding: 15px;
        border-top: 1px solid #e5e7eb;
        background: #f9fafb;
      ">
        <a href="messagerie.html" style="
          display: block;
          text-align: center;
          color: var(--secondary);
          text-decoration: none;
          font-weight: 600;
          padding: 10px;
          border-radius: 8px;
          transition: background 0.2s;
        ">Voir tous les messages →</a>
      </div>
    </div>
  `;
  
  document.body.appendChild(widget);
  
  // Événements
  const widgetButton = document.getElementById('messageWidgetButton');
  const widgetPanel = document.getElementById('messageWidgetPanel');
  const closeBtn = document.getElementById('closeWidgetBtn');
  
  // Ouvrir/fermer le panneau
  widgetButton.addEventListener('click', async () => {
    const isVisible = widgetPanel.style.display === 'flex';
    
    if (isVisible) {
      widgetPanel.style.display = 'none';
    } else {
      widgetPanel.style.display = 'flex';
      await loadWidgetConversations();
    }
  });
  
  // Fermer le panneau
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    widgetPanel.style.display = 'none';
  });
  
  // Hover effect sur le bouton
  widgetButton.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 6px 30px rgba(37, 99, 235, 0.5)';
  });
  
  widgetButton.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 4px 20px rgba(37, 99, 235, 0.4)';
  });
  
  // Fermer si on clique en dehors
  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target) && widgetPanel.style.display === 'flex') {
      widgetPanel.style.display = 'none';
    }
  });
}

// Mettre à jour le compteur de messages non lus
async function updateUnreadCount() {
  if (!currentUserId) return;
  
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', currentUserId)
      .eq('is_read', false);
    
    if (error) {
      console.error('❌ Erreur comptage messages:', error);
      return;
    }
    
    const badge = document.getElementById('unreadBadge');
    
    if (badge) {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Charger les conversations dans le widget
async function loadWidgetConversations() {
  const container = document.getElementById('widgetConversationsList');
  
  if (!container) return;
  
  container.innerHTML = '<div style="text-align: center; padding: 40px 20px; color: #9ca3af;">⏳ Chargement...</div>';
  
  try {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        user1:profiles!conversations_user1_id_fkey(id, first_name, last_name, user_type),
        user2:profiles!conversations_user2_id_fkey(id, first_name, last_name, user_type)
      `)
      .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
      .order('updated_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('❌ Erreur chargement conversations:', error);
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #9ca3af;">
          <div style="font-size: 3em; margin-bottom: 10px;">📭</div>
          <p style="margin: 0; font-size: 0.9em;">Aucun message pour le moment</p>
        </div>
      `;
      return;
    }
    
    if (!conversations || conversations.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #9ca3af;">
          <div style="font-size: 3em; margin-bottom: 10px;">📭</div>
          <p style="margin: 0; font-size: 0.9em;">Aucun message</p>
        </div>
      `;
      return;
    }
    
    // Compter les messages non lus par conversation
    const { data: unreadMessages } = await supabase
      .from('messages')
      .select('conversation_id')
      .eq('receiver_id', currentUserId)
      .eq('is_read', false);
    
    const unreadCounts = {};
    if (unreadMessages) {
      unreadMessages.forEach(msg => {
        unreadCounts[msg.conversation_id] = (unreadCounts[msg.conversation_id] || 0) + 1;
      });
    }
    
    // Afficher les conversations
    container.innerHTML = conversations.map(conv => {
      const otherUser = conv.user1_id === currentUserId ? conv.user2 : conv.user1;
      const otherUserName = `${otherUser.first_name} ${otherUser.last_name}`;
      const userIcon = otherUser.user_type === 'chercheur' ? '👤' : '💼';
      const unreadCount = unreadCounts[conv.id] || 0;
      
      const lastMessageDate = new Date(conv.updated_at);
      const now = new Date();
      const diffHours = Math.floor((now - lastMessageDate) / (1000 * 60 * 60));
      let timeStr = diffHours < 1 ? 'maintenant' : diffHours < 24 ? `${diffHours}h` : `${Math.floor(diffHours / 24)}j`;
      
      return `
        <div onclick="window.location.href='messagerie.html?conv=${conv.id}'" style="
          padding: 15px;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          transition: background 0.2s;
          background: ${unreadCount > 0 ? '#eff6ff' : 'white'};
        " onmouseenter="this.style.background='#f9fafb'" onmouseleave="this.style.background='${unreadCount > 0 ? '#eff6ff' : 'white'}'">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #3b82f6, #2563eb);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.2em;
              flex-shrink: 0;
            ">${userIcon}</div>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                <h4 style="
                  margin: 0;
                  font-size: 0.95em;
                  color: var(--primary);
                  font-weight: ${unreadCount > 0 ? '700' : '600'};
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                ">${otherUserName}</h4>
                <span style="font-size: 0.7em; color: #9ca3af; white-space: nowrap; margin-left: 8px;">${timeStr}</span>
              </div>
              ${conv.last_message ? `
                <p style="
                  margin: 0;
                  font-size: 0.85em;
                  color: #9ca3af;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  font-weight: ${unreadCount > 0 ? '600' : '400'};
                ">${conv.last_message}</p>
              ` : ''}
              ${unreadCount > 0 ? `
                <span style="
                  display: inline-block;
                  margin-top: 4px;
                  background: #ef4444;
                  color: white;
                  padding: 2px 8px;
                  border-radius: 10px;
                  font-size: 0.7em;
                  font-weight: 600;
                ">${unreadCount} nouveau${unreadCount > 1 ? 'x' : ''}</span>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #9ca3af;">
        <div style="font-size: 3em; margin-bottom: 10px;">📭</div>
        <p style="margin: 0; font-size: 0.9em;">Aucun message pour le moment</p>
      </div>
    `;
  }
}

// Nettoyer à la fermeture
window.addEventListener('beforeunload', () => {
  if (messageWidgetInterval) {
    clearInterval(messageWidgetInterval);
  }
});
