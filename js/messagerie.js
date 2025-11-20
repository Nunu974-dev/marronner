// Script pour la messagerie
console.log('💬 Script messagerie chargé');

let currentUserId = null;
let currentUserType = null;
let currentConversationId = null;
let messagesPollingInterval = null;

// Vérifier l'authentification au chargement
(async () => {
  console.log('🔐 Vérification de l\'authentification...');
  
  const { data: { session } } = await supabase.auth.getSession();
  const loader = document.getElementById('pageLoader');
  const loginRequired = document.getElementById('loginRequired');
  const messagerieContainer = document.getElementById('messagerieContainer');
  
  if (!session) {
    console.log('❌ Utilisateur non connecté');
    loader.style.display = 'none';
    loginRequired.style.display = 'block';
  } else {
    console.log('✅ Utilisateur connecté:', session.user.email);
    currentUserId = session.user.id;
    
    // Récupérer le type d'utilisateur
    const profileResult = await getUserProfile(session.user.id);
    if (profileResult.success && profileResult.data) {
      currentUserType = profileResult.data.user_type;
    }
    
    loader.style.display = 'none';
    messagerieContainer.style.display = 'block';
    
    // Charger les conversations
    await loadConversations();
    
    // Vérifier si une conversation spécifique est demandée dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const conversationIdFromUrl = urlParams.get('conv');
    
    if (conversationIdFromUrl) {
      // Attendre un peu que les conversations soient chargées
      setTimeout(async () => {
        const conversationItem = document.querySelector(`[data-conversation-id="${conversationIdFromUrl}"]`);
        if (conversationItem) {
          conversationItem.click();
        } else {
          // Si la conversation n'est pas trouvée, la charger directement
          const { data: conv } = await supabase
            .from('conversations')
            .select(`
              *,
              user1:profiles!conversations_user1_id_fkey(id, first_name, last_name, user_type),
              user2:profiles!conversations_user2_id_fkey(id, first_name, last_name, user_type)
            `)
            .eq('id', conversationIdFromUrl)
            .single();
          
          if (conv) {
            const otherUser = conv.user1_id === currentUserId ? conv.user2 : conv.user1;
            const otherUserName = `${otherUser.first_name} ${otherUser.last_name}`;
            const otherUserType = otherUser.user_type === 'chercheur' ? 'Chercheur' : 'Marronneur';
            openConversation(conversationIdFromUrl, otherUserName, otherUserType);
            
            // Recharger les conversations pour afficher la nouvelle
            await loadConversations();
          }
        }
      }, 500);
    }
  }
})();

// Charger les conversations
async function loadConversations() {
  console.log('📥 Chargement des conversations...');
  
  const conversationsList = document.getElementById('conversationsList');
  conversationsList.innerHTML = '<div style="text-align: center; padding: 20px; color: #9ca3af;">⏳ Chargement...</div>';
  
  try {
    // Récupérer toutes les conversations de l'utilisateur
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        user1:profiles!conversations_user1_id_fkey(id, first_name, last_name, user_type),
        user2:profiles!conversations_user2_id_fkey(id, first_name, last_name, user_type)
      `)
      .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('❌ Erreur lors du chargement des conversations:', error);
      conversationsList.innerHTML = `
        <div style="text-align: center; padding: 30px 20px; color: #9ca3af;">
          <div style="font-size: 3em; margin-bottom: 10px;">💭</div>
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #6b7280;">Messagerie en préparation</p>
          <p style="margin: 0; font-size: 0.9em;">La fonctionnalité sera bientôt disponible</p>
        </div>
      `;
      return;
    }
    
    if (!conversations || conversations.length === 0) {
      conversationsList.innerHTML = `
        <div style="text-align: center; padding: 30px 20px; color: #9ca3af;">
          <div style="font-size: 3em; margin-bottom: 10px;">📭</div>
          <p style="margin: 0; font-size: 0.95em;">Aucune conversation</p>
        </div>
      `;
      return;
    }
    
    // Afficher les conversations
    conversationsList.innerHTML = conversations.map(conv => {
      // Déterminer l'autre utilisateur
      const otherUser = conv.user1_id === currentUserId ? conv.user2 : conv.user1;
      const otherUserName = `${otherUser.first_name} ${otherUser.last_name}`;
      const otherUserType = otherUser.user_type === 'chercheur' ? 'Chercheur' : 'Marronneur';
      const userIcon = otherUser.user_type === 'chercheur' ? '👤' : '💼';
      
      // Formater la date
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
        <div class="conversation-item" data-conversation-id="${conv.id}" data-other-user-id="${otherUser.id}" data-other-user-name="${otherUserName}" data-other-user-type="${otherUserType}" style="padding: 15px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; border-bottom: 1px solid #f3f4f6; margin-bottom: 5px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5em; flex-shrink: 0;">
              ${userIcon}
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <h4 style="margin: 0; font-size: 1em; color: var(--primary); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${otherUserName}</h4>
                <span style="font-size: 0.75em; color: #9ca3af; white-space: nowrap; margin-left: 10px;">${timeStr}</span>
              </div>
              <p style="margin: 0; font-size: 0.85em; color: #6b7280;">${otherUserType}</p>
              ${conv.last_message ? `<p style="margin: 4px 0 0 0; font-size: 0.85em; color: #9ca3af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${conv.last_message}</p>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    // Ajouter les événements click
    document.querySelectorAll('.conversation-item').forEach(item => {
      item.addEventListener('click', () => {
        const conversationId = item.dataset.conversationId;
        const otherUserName = item.dataset.otherUserName;
        const otherUserType = item.dataset.otherUserType;
        
        // Retirer la classe active de tous les items
        document.querySelectorAll('.conversation-item').forEach(i => {
          i.style.background = 'transparent';
        });
        
        // Ajouter la classe active à l'item sélectionné
        item.style.background = '#eff6ff';
        
        openConversation(conversationId, otherUserName, otherUserType);
      });
      
      // Hover effect
      item.addEventListener('mouseenter', function() {
        if (this.style.background !== 'rgb(239, 246, 255)') {
          this.style.background = '#f9fafb';
        }
      });
      
      item.addEventListener('mouseleave', function() {
        if (this.style.background !== 'rgb(239, 246, 255)') {
          this.style.background = 'transparent';
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    conversationsList.innerHTML = `
      <div style="text-align: center; padding: 30px 20px; color: #9ca3af;">
        <div style="font-size: 3em; margin-bottom: 10px;">💭</div>
        <p style="margin: 0 0 10px 0; font-weight: 600; color: #6b7280;">Messagerie en préparation</p>
        <p style="margin: 0; font-size: 0.9em;">La fonctionnalité sera bientôt disponible</p>
      </div>
    `;
  }
}

// Ouvrir une conversation
async function openConversation(conversationId, otherUserName, otherUserType) {
  console.log('📖 Ouverture conversation:', conversationId);
  
  currentConversationId = conversationId;
  
  // Afficher le header et la zone de saisie
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('conversationHeader').style.display = 'block';
  document.getElementById('messagesArea').style.display = 'block';
  document.getElementById('messageInput').style.display = 'block';
  
  // Mettre à jour le header
  document.getElementById('conversationName').textContent = otherUserName;
  document.getElementById('conversationInfo').textContent = otherUserType;
  
  // Charger les messages
  await loadMessages(conversationId);
  
  // Marquer les messages comme lus
  await markMessagesAsRead(conversationId);
  
  // Démarrer le polling pour les nouveaux messages
  if (messagesPollingInterval) {
    clearInterval(messagesPollingInterval);
  }
  messagesPollingInterval = setInterval(() => loadMessages(conversationId, true), 3000);
}

// Charger les messages d'une conversation
async function loadMessages(conversationId, silent = false) {
  const messagesArea = document.getElementById('messagesArea');
  
  if (!silent) {
    messagesArea.innerHTML = '<div style="text-align: center; padding: 20px; color: #9ca3af;">⏳ Chargement...</div>';
  }
  
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(first_name, last_name, user_type)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('❌ Erreur lors du chargement des messages:', error);
      messagesArea.innerHTML = '<div style="padding: 20px; color: #ef4444; text-align: center;">Erreur de chargement</div>';
      return;
    }
    
    if (!messages || messages.length === 0) {
      messagesArea.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #9ca3af;">
          <div style="font-size: 3em; margin-bottom: 10px;">💬</div>
          <p style="margin: 0;">Aucun message pour le moment</p>
          <p style="margin: 10px 0 0 0; font-size: 0.9em;">Envoyez le premier message !</p>
        </div>
      `;
      return;
    }
    
    // Sauvegarder la position de scroll actuelle
    const wasAtBottom = messagesArea.scrollHeight - messagesArea.scrollTop <= messagesArea.clientHeight + 100;
    
    // Afficher les messages
    messagesArea.innerHTML = messages.map(msg => {
      const isMe = msg.sender_id === currentUserId;
      const senderName = `${msg.sender.first_name} ${msg.sender.last_name}`;
      const messageTime = new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      
      return `
        <div style="display: flex; justify-content: ${isMe ? 'flex-end' : 'flex-start'}; margin-bottom: 15px;">
          <div style="max-width: 70%; ${isMe ? 'text-align: right;' : ''}">
            ${!isMe ? `<p style="margin: 0 0 5px 0; font-size: 0.85em; color: #6b7280; font-weight: 600;">${senderName}</p>` : ''}
            <div style="background: ${isMe ? 'linear-gradient(135deg, #2563eb, #3b82f6)' : 'white'}; color: ${isMe ? 'white' : '#1f2937'}; padding: 12px 16px; border-radius: ${isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px'}; box-shadow: 0 2px 8px rgba(0,0,0,0.1); word-wrap: break-word;">
              <p style="margin: 0; line-height: 1.5;">${msg.content}</p>
            </div>
            <p style="margin: 5px 0 0 0; font-size: 0.75em; color: #9ca3af;">${messageTime}</p>
          </div>
        </div>
      `;
    }).join('');
    
    // Scroller en bas seulement si on était déjà en bas ou si c'est le premier chargement
    if (!silent || wasAtBottom) {
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    messagesArea.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #9ca3af;">
        <div style="font-size: 3em; margin-bottom: 10px;">💭</div>
        <p style="margin: 0; font-size: 0.9em;">Impossible de charger les messages</p>
      </div>
    `;
  }
}

// Marquer les messages comme lus
async function markMessagesAsRead(conversationId) {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', currentUserId)
      .eq('is_read', false);
    
    if (error) {
      console.error('❌ Erreur lors du marquage des messages comme lus:', error);
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Envoyer un message
document.addEventListener('DOMContentLoaded', () => {
  const sendMessageForm = document.getElementById('sendMessageForm');
  const messageText = document.getElementById('messageText');
  
  if (sendMessageForm) {
    sendMessageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const message = messageText.value.trim();
      
      if (!message || !currentConversationId) {
        return;
      }
      
      console.log('📤 Envoi du message...');
      
      try {
        // Récupérer les infos de la conversation pour savoir à qui envoyer
        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .select('user1_id, user2_id')
          .eq('id', currentConversationId)
          .single();
        
        if (convError) {
          console.error('❌ Erreur:', convError);
          showMessage('Erreur lors de l\'envoi du message', 'error');
          return;
        }
        
        const receiverId = conversation.user1_id === currentUserId ? conversation.user2_id : conversation.user1_id;
        
        // Insérer le message
        const { data: newMessage, error: msgError } = await supabase
          .from('messages')
          .insert({
            conversation_id: currentConversationId,
            sender_id: currentUserId,
            receiver_id: receiverId,
            content: message,
            is_read: false
          })
          .select()
          .single();
        
        if (msgError) {
          console.error('❌ Erreur:', msgError);
          showMessage('Erreur lors de l\'envoi du message', 'error');
          return;
        }
        
        // Mettre à jour la conversation
        await supabase
          .from('conversations')
          .update({
            last_message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
            updated_at: new Date().toISOString()
          })
          .eq('id', currentConversationId);
        
        // Réinitialiser le champ
        messageText.value = '';
        messageText.style.height = 'auto';
        
        // Recharger les messages
        await loadMessages(currentConversationId);
        
        // Recharger la liste des conversations
        await loadConversations();
        
      } catch (error) {
        console.error('❌ Erreur:', error);
        showMessage('Erreur lors de l\'envoi du message', 'error');
      }
    });
    
    // Auto-resize du textarea
    messageText.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    
    // Envoyer avec Entrée (Shift+Entrée pour nouvelle ligne)
    messageText.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessageForm.dispatchEvent(new Event('submit'));
      }
    });
  }
  
  // Recherche dans les conversations
  const searchInput = document.getElementById('searchConversations');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const conversations = document.querySelectorAll('.conversation-item');
      
      conversations.forEach(conv => {
        const name = conv.dataset.otherUserName.toLowerCase();
        if (name.includes(searchTerm)) {
          conv.style.display = 'block';
        } else {
          conv.style.display = 'none';
        }
      });
    });
  }
});

// Nettoyer le polling quand on quitte la page
window.addEventListener('beforeunload', () => {
  if (messagesPollingInterval) {
    clearInterval(messagesPollingInterval);
  }
});

// Fonction pour afficher un message
function showMessage(message, type) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `custom-message ${type}`;
  msgDiv.textContent = message;
  document.body.appendChild(msgDiv);
  
  setTimeout(() => msgDiv.classList.add('show'), 10);
  
  setTimeout(() => {
    msgDiv.classList.remove('show');
    setTimeout(() => msgDiv.remove(), 300);
  }, 3000);
}
