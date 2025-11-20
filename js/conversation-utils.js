// Fonction utilitaire pour démarrer une conversation
// À inclure dans les pages où on veut permettre de contacter quelqu'un

async function startConversation(otherUserId) {
  console.log('💬 Démarrage conversation avec:', otherUserId);
  
  try {
    // Vérifier que l'utilisateur est connecté
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      showMessage('Vous devez être connecté pour envoyer un message', 'error');
      setTimeout(() => {
        window.location.href = 'connexion.html';
      }, 1500);
      return;
    }
    
    const currentUserId = session.user.id;
    
    if (currentUserId === otherUserId) {
      showMessage('Vous ne pouvez pas vous envoyer un message à vous-même', 'error');
      return;
    }
    
    // Créer ou récupérer la conversation via la fonction SQL
    const { data, error } = await supabase.rpc('get_or_create_conversation', {
      user_a: currentUserId,
      user_b: otherUserId
    });
    
    if (error) {
      console.error('❌ Erreur:', error);
      showMessage('Erreur lors de la création de la conversation', 'error');
      return;
    }
    
    const conversationId = data;
    console.log('✅ Conversation créée/récupérée:', conversationId);
    
    // Rediriger vers la messagerie avec l'ID de la conversation
    window.location.href = `messagerie.html?conv=${conversationId}`;
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    showMessage('Erreur lors de la création de la conversation', 'error');
  }
}

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
