// Gestion de l'authentification avec Supabase
console.log('🔐 Module authentification chargé');

// Fonction pour afficher un message personnalisé
function showMessage(text, type = 'info') {
  // Supprimer l'ancien message s'il existe
  const oldMessage = document.querySelector('.custom-message');
  if (oldMessage) oldMessage.remove();
  
  // Créer le nouveau message
  const messageDiv = document.createElement('div');
  messageDiv.className = `custom-message ${type}`;
  messageDiv.textContent = text;
  
  // Ajouter au body
  document.body.appendChild(messageDiv);
  
  // Animation d'apparition
  setTimeout(() => messageDiv.classList.add('show'), 10);
  
  // Supprimer après 4 secondes
  setTimeout(() => {
    messageDiv.classList.remove('show');
    setTimeout(() => messageDiv.remove(), 300);
  }, 4000);
}

document.addEventListener("DOMContentLoaded", async () => {
  // La vérification de session est gérée par supabase-config.js
  // On n'a plus besoin de la faire ici pour éviter les doubles appels
  
  // ============================================
  // VALIDATION EN TEMPS RÉEL DU MOT DE PASSE
  // ============================================
  
  const passwordInput = document.getElementById('signupPassword');
  const passwordConfirmInput = document.getElementById('signupPasswordConfirm');
  
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      
      // Vérifier chaque critère
      const hasLength = password.length >= 8;
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      // Mettre à jour les indicateurs visuels
      updateRequirement('req-length', hasLength);
      updateRequirement('req-upper', hasUpper);
      updateRequirement('req-lower', hasLower);
      updateRequirement('req-number', hasNumber);
      updateRequirement('req-special', hasSpecial);
      
      // Vérifier la correspondance si confirmation déjà remplie
      if (passwordConfirmInput && passwordConfirmInput.value) {
        checkPasswordMatch();
      }
    });
  }
  
  if (passwordConfirmInput) {
    passwordConfirmInput.addEventListener('input', checkPasswordMatch);
  }
  
  function updateRequirement(id, isValid) {
    const element = document.getElementById(id);
    if (!element) return;
    
    element.classList.remove('valid', 'invalid');
    if (isValid) {
      element.classList.add('valid');
    } else if (document.getElementById('signupPassword').value.length > 0) {
      element.classList.add('invalid');
    }
  }
  
  function checkPasswordMatch() {
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    const matchElement = document.getElementById('req-match');
    
    if (!matchElement || !passwordConfirm) return;
    
    const isMatch = password === passwordConfirm && password.length > 0;
    matchElement.classList.remove('valid', 'invalid');
    
    if (isMatch) {
      matchElement.classList.add('valid');
    } else if (passwordConfirm.length > 0) {
      matchElement.classList.add('invalid');
    }
  }

  // ============================================
  // GESTION INSCRIPTION
  // ============================================
  
  const signupFormStep2 = document.getElementById('signupFormStep2');
  
  if (signupFormStep2) {
    signupFormStep2.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Récupérer les valeurs
      const firstName = document.getElementById('signupFirstName').value.trim();
      const lastName = document.getElementById('signupLastName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
      const phone = document.getElementById('signupPhone').value.trim();
      const userType = document.getElementById('signupUserType').value;
      
      console.log('🔍 Validation des champs...');
      
      // VALIDATION 1 : Champs vides
      if (!firstName || !lastName || !email || !password || !passwordConfirm || !userType) {
        showMessage('Tous les champs obligatoires doivent être remplis !', 'error');
        return;
      }
      
      // VALIDATION 2 : Mots de passe identiques
      if (password !== passwordConfirm) {
        showMessage('Les mots de passe ne correspondent pas !', 'error');
        return;
      }
      
      // VALIDATION 3 : Longueur minimale
      if (password.length < 8) {
        showMessage('Le mot de passe doit contenir au moins 8 caractères !', 'error');
        return;
      }
      
      // VALIDATION 4 : Mot de passe fort
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      if (!hasUpperCase) {
        showMessage('Le mot de passe doit contenir au moins 1 majuscule', 'error');
        return;
      }
      
      if (!hasLowerCase) {
        showMessage('Le mot de passe doit contenir au moins 1 minuscule', 'error');
        return;
      }
      
      if (!hasNumber) {
        showMessage('Le mot de passe doit contenir au moins 1 chiffre', 'error');
        return;
      }
      
      if (!hasSpecialChar) {
        showMessage('Le mot de passe doit contenir au moins 1 caractère spécial (!@#$%...)', 'error');
        return;
      }
      
      console.log('✅ Toutes les validations passées !');
      console.log('📊 Données:', { firstName, lastName, email, userType, passwordLength: password.length });
      
      // Afficher un loader
      const submitBtn = signupFormStep2.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '⏳ Création en cours...';
      submitBtn.disabled = true;
      
      console.log('📤 Envoi inscription...', { email, firstName, lastName, userType });
      
      // Créer le compte avec Supabase
      const result = await signUpWithEmail(email, password, firstName, lastName, userType, phone);
      
      console.log('📥 Résultat inscription:', result);
      
      if (result.success) {
        console.log('🎉 SUCCESS - Compte créé avec succès');
        showMessage('✅ Compte créé ! Redirection vers le tableau de bord...', 'success');
        
        // Rediriger vers le tableau de bord après 2 secondes
        setTimeout(() => {
          console.log('🔄 Redirection vers tableau-de-bord.html');
          window.location.href = 'tableau-de-bord.html';
        }, 2000);
      } else {
        console.error('❌ ERREUR lors de l\'inscription:', result);
        console.error('❌ Erreur complète:', result);
        showMessage('Erreur : ' + result.error, 'error');
        
        // Réactiver le bouton immédiatement en cas d'erreur
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
  
  // ============================================
  // GESTION CONNEXION
  // ============================================
  
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = loginForm.querySelector('input[type="email"]').value.trim();
      const password = loginForm.querySelector('input[type="password"]').value;
      
      if (!email || !password) {
        showMessage('Merci de remplir tous les champs !', 'error');
        return;
      }
      
      // Afficher un loader
      const submitBtn = loginForm.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '⏳ Connexion...';
      submitBtn.disabled = true;
      
      // Se connecter avec Supabase
      const result = await signInWithEmail(email, password);
      
      if (result.success) {
        showMessage('Connexion réussie ! Bienvenue 👋', 'success');
        
        // Fermer le modal
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
          loginModal.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
        
        // Recharger la page pour mettre à jour l'UI
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showMessage('Email ou mot de passe incorrect', 'error');
      }
      
      // Réactiver le bouton
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  }
  
  // ============================================
  // CONNEXION GOOGLE
  // ============================================
  
  const googleButtons = document.querySelectorAll('.social-btn');
  googleButtons.forEach(btn => {
    const btnText = btn.textContent.toLowerCase();
    
    if (btnText.includes('google')) {
      btn.onclick = async (e) => {
        e.preventDefault();
        const result = await signInWithGoogle();
        if (!result.success && result.error) {
          showMessage('Erreur Google : ' + result.error, 'error');
        }
      };
    } else if (btnText.includes('facebook')) {
      btn.onclick = async (e) => {
        e.preventDefault();
        const result = await signInWithFacebook();
        if (!result.success && result.error) {
          showMessage('Erreur Facebook : ' + result.error, 'error');
        }
      };
    } else if (btnText.includes('apple')) {
      btn.onclick = (e) => {
        e.preventDefault();
        showMessage('Apple Sign-In nécessite une configuration supplémentaire', 'info');
      };
    }
  });
});
