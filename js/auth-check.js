// Vérification de l'authentification sur toutes les pages
// À charger sur chaque page HTML

console.log('🔐 Vérification authentification...');

// Fonction pour mettre à jour le header selon l'état de connexion
async function updateHeaderAuth() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const menuContainer = document.querySelector('.menu');
    if (!menuContainer) return;
    
    // Chercher ou créer les liens d'authentification
    let loginLink = menuContainer.querySelector('a[href*="connexion"]');
    let signupLink = menuContainer.querySelector('a[href*="inscription"]');
    
    if (user) {
      console.log('✅ Utilisateur connecté:', user.email);
      
      // Remplacer "Connexion" par "Tableau de bord"
      if (loginLink) {
        loginLink.textContent = '👤 Mon compte';
        loginLink.href = 'tableau-de-bord.html';
      }
      
      // Cacher "S'inscrire"
      if (signupLink) {
        signupLink.style.display = 'none';
      }
      
      // Ajouter bouton déconnexion si pas déjà présent
      if (!menuContainer.querySelector('.logout-btn')) {
        const logoutBtn = document.createElement('a');
        logoutBtn.href = '#';
        logoutBtn.className = 'logout-btn';
        logoutBtn.textContent = '🚪 Déconnexion';
        logoutBtn.style.color = '#ef4444';
        logoutBtn.onclick = async (e) => {
          e.preventDefault();
          const { error } = await supabase.auth.signOut();
          if (!error) {
            window.location.href = 'index.html';
          }
        };
        menuContainer.appendChild(logoutBtn);
      }
    } else {
      console.log('👤 Utilisateur non connecté');
      
      // S'assurer que les liens de connexion/inscription sont visibles
      if (loginLink) {
        loginLink.textContent = 'Connexion';
        loginLink.href = 'connexion.html';
      } else {
        // Créer le lien si absent
        const newLoginLink = document.createElement('a');
        newLoginLink.href = 'connexion.html';
        newLoginLink.textContent = 'Connexion';
        menuContainer.appendChild(newLoginLink);
      }
      
      if (signupLink) {
        signupLink.style.display = 'inline-block';
      } else {
        // Créer le lien si absent
        const newSignupLink = document.createElement('a');
        newSignupLink.href = 'inscription.html';
        newSignupLink.className = 'cta';
        newSignupLink.textContent = "S'inscrire";
        menuContainer.appendChild(newSignupLink);
      }
      
      // Retirer le bouton déconnexion si présent
      const logoutBtn = menuContainer.querySelector('.logout-btn');
      if (logoutBtn) {
        logoutBtn.remove();
      }
    }
  } catch (error) {
    console.error('Erreur vérification auth:', error);
  }
}

// Vérifier l'authentification au chargement de la page
if (typeof supabase !== 'undefined') {
  document.addEventListener('DOMContentLoaded', updateHeaderAuth);
  
  // Écouter les changements d'état d'authentification
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth state:', event);
    updateHeaderAuth();
  });
} else {
  console.warn('⚠️ Supabase non chargé - impossible de vérifier l\'authentification');
}
