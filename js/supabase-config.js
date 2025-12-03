// Configuration Supabase pour Marronner
// ✅ Configuré et prêt à l'emploi !

const SUPABASE_URL = 'https://spgtfcjjtdpfzpryqafq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZ3RmY2pqdGRwZnpwcnlxYWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MDA2MjMsImV4cCI6MjA3ODk3NjYyM30.Cy8a-k-lh2IM_sHqW46xtpaylDg7eQKH1oqDIZ6teoA';

// Vérifier que le SDK Supabase est chargé
if (typeof window.supabase === 'undefined') {
  console.error('❌ SDK Supabase non chargé ! Vérifiez que le script CDN est bien présent.');
} else {
  console.log('✅ SDK Supabase chargé');
}

// Initialiser Supabase
const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

if (supabase) {
  console.log('✅ Client Supabase initialisé:', SUPABASE_URL);
} else {
  console.error('❌ Impossible d\'initialiser le client Supabase');
}

// Vérifier si l'utilisateur est connecté
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Inscription par email
async function signUpWithEmail(email, password, firstName, lastName, userType, phone) {
  try {
    console.log('🔄 Tentative d\'inscription...', { email, firstName, lastName, userType });
    
    // 1. Créer le compte
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
          phone: phone || null
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw error;
    }

    console.log('✅ Compte créé:', data);

    // 2. Créer le profil dans la table profiles (si pas auto-créé par trigger)
    if (data.user) {
      console.log('📝 Création du profil...');
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([
          {
            id: data.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
            phone: phone || null,
            onboarding_completed: userType === 'chercheur', // Les chercheurs n'ont pas besoin d'onboarding
            created_at: new Date().toISOString()
          }
        ], { onConflict: 'id' });

      if (profileError) {
        console.error('⚠️ Erreur profil (non bloquant):', profileError);
      } else {
        console.log('✅ Profil créé');
      }
    }

    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur inscription:', error);
    return { success: false, error: error.message };
  }
}

// Connexion par email
async function signInWithEmail(email, password) {
  try {
    console.log('🔄 Tentative de connexion...', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error('❌ Erreur connexion:', error);
      throw error;
    }
    
    console.log('✅ Connexion réussie:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur connexion:', error);
    return { success: false, error: error.message };
  }
}

// Réinitialisation du mot de passe
async function resetPassword(email) {
  try {
    console.log('🔄 Demande de réinitialisation mot de passe...', email);
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://marronner.re/reset-password.html'
    });

    if (error) {
      console.error('❌ Erreur réinitialisation:', error);
      throw error;
    }
    
    console.log('✅ Email de réinitialisation envoyé');
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur réinitialisation:', error);
    return { success: false, error: error.message };
  }
}

// Connexion avec Google
async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erreur Google:', error);
    return { success: false, error: error.message };
  }
}

// Connexion avec Facebook
async function signInWithFacebook() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erreur Facebook:', error);
    return { success: false, error: error.message };
  }
}

// Déconnexion
async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = 'index.html';
    return { success: true };
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    return { success: false, error: error.message };
  }
}

// Récupérer le profil utilisateur
async function getUserProfile(userId) {
  try {
    console.log('🔍 getUserProfile appelé pour userId:', userId);
    
    // Créer une promesse avec timeout de 10 secondes
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout après 10 secondes')), 10000)
    );
    
    // Utiliser select sans .single() pour éviter le bug
    const query = supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .limit(1);
    
    // Race entre la requête et le timeout
    const result = await Promise.race([query, timeout]);
    
    console.log('🔍 Réponse Supabase brute:', result);
    
    if (result.error) throw result.error;
    
    // Prendre le premier élément du tableau
    const data = result.data && result.data.length > 0 ? result.data[0] : null;
    
    if (!data) {
      throw new Error('Aucun profil trouvé');
    }
    
    console.log('✅ getUserProfile succès:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur getUserProfile:', error);
    return { success: false, error: error.message };
  }
}

// Vérifier l'état de connexion au chargement
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('🔔 AUTH STATE CHANGE:', event, session ? session.user.email : 'no session');
  
  // Ne pas gérer SIGNED_IN sur index.html (auth.js le fait déjà après inscription)
  if (event === 'SIGNED_IN' && window.location.pathname.endsWith('index.html')) {
    console.log('⚠️ SIGNED_IN sur index.html - laissé à auth.js');
    return;
  }
  
  // Gérer tous les autres événements normalement
  if (session && event !== 'INITIAL_SESSION') {
    console.log('✅ Utilisateur connecté:', session.user.email);
    await updateUIForLoggedInUser(session.user);
  } else if (event === 'SIGNED_OUT') {
    console.log('👋 Utilisateur déconnecté');
    updateUIForLoggedOutUser();
  }
});

// Vérifier la session au chargement de la page
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('🔍 Session au chargement:', session ? session.user.email : 'aucune session');
  
  if (session) {
    await updateUIForLoggedInUser(session.user);
  } else {
    updateUIForLoggedOutUser();
  }
  
  // Marquer que l'authentification est prête
  document.body.classList.add('auth-ready');
})();

// Mettre à jour l'interface pour utilisateur connecté
async function updateUIForLoggedInUser(user) {
  console.log('🎨 Mise à jour UI pour utilisateur connecté');
  
  try {
    let userType = 'Profil'; // Valeur par défaut
    let onboardingCompleted = false;
    
    // Toujours récupérer le profil depuis la base de données pour avoir onboarding_completed
    console.log('📡 Récupération du profil depuis la base...');
    const profileResult = await getUserProfile(user.id);
    console.log('📦 Résultat profil:', profileResult);
    
    if (profileResult.success && profileResult.data) {
      userType = profileResult.data.user_type === 'chercheur' ? 'Chercheur' : 'Marronneur';
      onboardingCompleted = profileResult.data.onboarding_completed || false;
      console.log('👤 Type utilisateur:', userType);
      console.log('✅ Onboarding complété:', onboardingCompleted);
    } else {
      console.error('⚠️ Échec récupération profil:', profileResult.error);
      // Fallback sur les métadonnées si la base ne répond pas
      if (user.user_metadata && user.user_metadata.user_type) {
        userType = user.user_metadata.user_type === 'chercheur' ? 'Chercheur' : 'Marronneur';
        console.log('👤 Type utilisateur (fallback métadonnées):', userType);
      } else {
        console.warn('⚠️ Profil non récupéré, utilisation de la valeur par défaut');
      }
    }
    
    // Rediriger vers l'onboarding si marronneur et onboarding non complété
    const currentPage = window.location.pathname.split('/').pop();
    if (userType === 'Marronneur' && !onboardingCompleted && currentPage !== 'onboarding.html') {
      console.log('🚀 Redirection vers onboarding (profil incomplet)');
      window.location.href = 'onboarding.html';
      return;
    }
    
    // Mettre à jour le texte du bouton profil
    const userTypeDisplay = document.getElementById('userTypeDisplay');
    console.log('🔍 Élément userTypeDisplay trouvé:', userTypeDisplay);
    if (userTypeDisplay) {
      userTypeDisplay.textContent = userType;
      console.log('✅ Texte mis à jour:', userType);
    } else {
      console.warn('⚠️ Élément #userTypeDisplay non trouvé dans le DOM');
    }
    
    // Masquer les boutons logged-out, afficher les boutons logged-in
    document.querySelectorAll('.auth-link.logged-out').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.auth-link.logged-in').forEach(el => el.style.display = 'inline-block');
    
    console.log('✅ UI mise à jour - Mode connecté');
  } catch (error) {
    console.error('❌ Erreur dans updateUIForLoggedInUser:', error);
  }
}

// Mettre à jour l'interface pour utilisateur déconnecté
function updateUIForLoggedOutUser() {
  console.log('🎨 Mise à jour UI pour utilisateur déconnecté');
  
  // Afficher les boutons logged-out, masquer les boutons logged-in
  document.querySelectorAll('.auth-link.logged-out').forEach(el => el.style.display = 'inline-block');
  document.querySelectorAll('.auth-link.logged-in').forEach(el => el.style.display = 'none');
  
  console.log('✅ UI mise à jour - Mode déconnecté');
}
