console.log("Marronner – site chargé avec succès !");
console.log("🔧 Version: 2.12.2024-20:30 - Fix soumission formulaire");

// ============================================
// FONCTIONS POUR MODALES (déclarées en premier)
// ============================================

// Fonction pour vérifier le hash et ouvrir la modale correspondante
function checkHashAndOpenModal() {
  const hash = window.location.hash;
  console.log('🔍 Hash détecté:', hash);
  
  // Attendre que les modales soient dans le DOM
  setTimeout(() => {
    const signupModal = document.getElementById('signupModal');
    const loginModal = document.getElementById('loginModal');
    
    console.log('🔍 Modales trouvées:', {
      signup: !!signupModal,
      login: !!loginModal
    });
    
    if (hash === '#signup' && signupModal) {
      console.log('📂 Ouverture modale inscription via hash');
      signupModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      window.history.replaceState(null, null, ' ');
    } else if (hash === '#login' && loginModal) {
      console.log('📂 Ouverture modale connexion via hash');
      loginModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      window.history.replaceState(null, null, ' ');
    }
  }, 100);
}

// --- Initialisation des modales d'authentification ---
function initializeAuthModals() {
  const signupModal = document.getElementById('signupModal');
  const loginModal = document.getElementById('loginModal');
  
  console.log('🔍 Initialisation modales:', {
    signupModal: !!signupModal,
    loginModal: !!loginModal
  });
  
  if (!signupModal || !loginModal) {
    console.error('❌ Modales non trouvées dans le DOM');
    return;
  }
  
  // Fonction pour ouvrir un modal
  function openModal(modal) {
    if (modal) {
      console.log('📂 Ouverture modal:', modal.id);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Fonction pour fermer un modal
  function closeModal(modal) {
    if (modal) {
      console.log('📁 Fermeture modal:', modal.id);
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
  
  // Intercepter les clics sur liens "S'inscrire" et "Connexion"
  const inscriptionLinks = document.querySelectorAll('a[href="inscription.html"], a[href*="inscription"]');
  console.log('🔗 Liens inscription trouvés:', inscriptionLinks.length);
  
  inscriptionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('👆 Clic sur lien inscription');
      openModal(signupModal);
    });
  });
  
  const connexionLinks = document.querySelectorAll('a[href="connexion.html"], a[href*="connexion"]');
  console.log('🔗 Liens connexion trouvés:', connexionLinks.length);
  
  connexionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('👆 Clic sur lien connexion');
      openModal(loginModal);
    });
  });
  
  // Fermer les modaux au clic sur bouton close
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(signupModal);
      closeModal(loginModal);
    });
  });
  
  // Fermer les modaux au clic sur l'overlay
  [signupModal, loginModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });
  
  // Basculer entre inscription et connexion
  document.querySelectorAll('.switch-to-login').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(signupModal);
      openModal(loginModal);
    });
  });
  
  document.querySelectorAll('.switch-to-signup').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(loginModal);
      openModal(signupModal);
    });
  });
  
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
      updatePasswordRequirement('req-length', hasLength);
      updatePasswordRequirement('req-upper', hasUpper);
      updatePasswordRequirement('req-lower', hasLower);
      updatePasswordRequirement('req-number', hasNumber);
      updatePasswordRequirement('req-special', hasSpecial);
      
      // Vérifier la correspondance si confirmation déjà remplie
      if (passwordConfirmInput && passwordConfirmInput.value) {
        checkPasswordsMatch();
      }
    });
  }
  
  if (passwordConfirmInput) {
    passwordConfirmInput.addEventListener('input', checkPasswordsMatch);
  }
  
  function updatePasswordRequirement(id, isValid) {
    const element = document.getElementById(id);
    if (!element) return;
    
    element.classList.remove('valid', 'invalid');
    const reqIcon = element.querySelector('.req-icon');
    
    if (isValid) {
      element.classList.add('valid');
      if (reqIcon) reqIcon.textContent = '✓';
    } else if (passwordInput.value.length > 0) {
      element.classList.add('invalid');
      if (reqIcon) reqIcon.textContent = '○';
    } else {
      if (reqIcon) reqIcon.textContent = '○';
    }
  }
  
  function checkPasswordsMatch() {
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    const matchElement = document.getElementById('req-match');
    
    if (!matchElement || !passwordConfirm) return;
    
    const isMatch = password === passwordConfirm && password.length > 0;
    matchElement.classList.remove('valid', 'invalid');
    const reqIcon = matchElement.querySelector('.req-icon');
    
    if (isMatch) {
      matchElement.classList.add('valid');
      if (reqIcon) reqIcon.textContent = '✓';
    } else if (passwordConfirm.length > 0) {
      matchElement.classList.add('invalid');
      if (reqIcon) reqIcon.textContent = '✗';
    } else {
      if (reqIcon) reqIcon.textContent = '○';
    }
  }
  
  // ============================================
  // GESTION SOUMISSION FORMULAIRE INSCRIPTION
  // ============================================
  
  const signupFormStep2 = document.getElementById('signupFormStep2');
  
  if (signupFormStep2) {
    console.log('✅ Formulaire inscription trouvé, ajout du listener');
    
    signupFormStep2.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('📝 Soumission formulaire inscription');
      
      // Récupérer les valeurs
      const firstName = document.getElementById('signupFirstName').value.trim();
      const lastName = document.getElementById('signupLastName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
      const phone = document.getElementById('signupPhone').value.trim();
      const userType = document.getElementById('signupUserType').value;
      
      console.log('🔍 Données formulaire:', { firstName, lastName, email, userType, phone });
      
      // Validation finale
      if (!firstName || !lastName || !email || !password || !passwordConfirm || !userType) {
        alert('❌ Tous les champs obligatoires doivent être remplis !');
        return;
      }
      
      if (password !== passwordConfirm) {
        alert('❌ Les mots de passe ne correspondent pas !');
        return;
      }
      
      // Afficher un loader
      const submitBtn = signupFormStep2.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '⏳ Création en cours...';
      submitBtn.disabled = true;
      
      console.log('📤 Appel signUpWithEmail...');
      
      try {
        // Créer le compte avec Supabase
        const result = await signUpWithEmail(email, password, firstName, lastName, userType, phone);
        
        console.log('📥 Résultat:', result);
        
        if (result.success) {
          console.log('🎉 Inscription réussie !');
          alert('✅ Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.');
          
          // Fermer la modale
          closeModal(signupModal);
          
          // Rediriger vers le tableau de bord après 2 secondes
          setTimeout(() => {
            window.location.href = 'tableau-de-bord.html';
          }, 2000);
        } else {
          console.error('❌ Erreur:', result.error);
          alert('❌ Erreur : ' + result.error);
          
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      } catch (error) {
        console.error('❌ Exception:', error);
        alert('❌ Une erreur est survenue : ' + error.message);
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  } else {
    console.error('❌ Formulaire signupFormStep2 non trouvé !');
  }
}

// --- Chargement dynamique des modales d'authentification ---
// Utilise un script pour insérer directement le HTML au lieu de fetch
(function loadAuthModals() {
  const modalsHTML = `
<!-- MODAL INSCRIPTION -->
<div class="auth-modal" id="signupModal">
  <div class="modal-content">
    <button class="modal-close">&times;</button>
    
    <div class="modal-image">
      <div class="modal-image-content">
        <div class="modal-image-icon">🌴</div>
        <h2>Bienvenue sur Marronner</h2>
        <p>Rejoins la communauté de talents et services 100% locale de La Réunion</p>
      </div>
    </div>
    
    <div class="modal-form">
      <!-- Étape 1 : Choix méthode inscription -->
      <div class="signup-step-1">
        <h2>Créer un compte</h2>
        <p>Choisis ta méthode d'inscription</p>
        
        <div class="social-buttons">
          <button class="social-btn" onclick="alert('Connexion Google (démo)')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continuer avec Google
          </button>
          
          <button class="social-btn" onclick="alert('Connexion Apple (démo)')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            Continuer avec Apple
          </button>
          
          <button class="social-btn" onclick="alert('Connexion Facebook (démo)')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continuer avec Facebook
          </button>
        </div>
        
        <div class="divider">
          <span>OU</span>
        </div>
        
        <button type="button" class="email-signup-btn" id="emailSignupBtn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          Créer un compte par email
        </button>
        
        <div class="switch-auth">
          Tu as déjà un compte ? <a href="#" class="switch-to-login">Connecte-toi</a>
        </div>
      </div>

      <!-- Étape 2 : Inscription par email -->
      <div class="signup-step-2" style="display: none;">
        <button class="back-btn" id="backToStep1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Retour
        </button>
        
        <h2>Inscription par email</h2>
        <p>Complète les informations ci-dessous</p>
        
        <form id="signupFormStep2">
          <div class="form-group">
            <label>Prénom</label>
            <input type="text" id="signupFirstName" required placeholder="Jean">
          </div>

          <div class="form-group">
            <label>Nom</label>
            <input type="text" id="signupLastName" required placeholder="Dupont">
          </div>

          <div class="form-group">
            <label>Adresse email</label>
            <input type="email" id="signupEmail" required placeholder="ton.email@exemple.com">
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input type="password" id="signupPassword" required placeholder="Minimum 8 caractères">
            <div class="password-requirements">
              <div class="requirement" id="req-length">
                <span class="req-icon">○</span>
                <span class="req-text">Au moins 8 caractères</span>
              </div>
              <div class="requirement" id="req-upper">
                <span class="req-icon">○</span>
                <span class="req-text">1 majuscule</span>
              </div>
              <div class="requirement" id="req-lower">
                <span class="req-icon">○</span>
                <span class="req-text">1 minuscule</span>
              </div>
              <div class="requirement" id="req-number">
                <span class="req-icon">○</span>
                <span class="req-text">1 chiffre</span>
              </div>
              <div class="requirement" id="req-special">
                <span class="req-icon">○</span>
                <span class="req-text">1 caractère spécial (!@#$%...)</span>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Confirme ton mot de passe</label>
            <input type="password" id="signupPasswordConfirm" required placeholder="Retape ton mot de passe">
            <div class="password-requirements">
              <div class="requirement" id="req-match">
                <span class="req-icon">○</span>
                <span class="req-text">Les mots de passe correspondent</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Numéro de téléphone (optionnel)</label>
            <input type="tel" id="signupPhone" placeholder="0692 XX XX XX">
          </div>

          <div class="form-group">
            <label>Je m'inscris en tant que</label>
            <select id="signupUserType" required>
              <option value="">Sélectionne ton profil</option>
              <option value="chercheur">Chercheur (je cherche des services)</option>
              <option value="marronneur">Marronneur (je propose mes services)</option>
            </select>
          </div>
          
          <div class="form-group captcha-group">
            <label>
              <input type="checkbox" required>
              Je ne suis pas un robot 🤖
            </label>
          </div>
          
          <button type="submit" class="submit-btn">Créer mon compte</button>
          
          <p class="terms">
            En t'inscrivant, tu acceptes nos 
            <a href="cgu.html">Conditions d'utilisation</a> et notre 
            <a href="confidentialite.html">Politique de confidentialité</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- MODAL CONNEXION -->
<div class="auth-modal" id="loginModal">
  <div class="modal-content">
    <button class="modal-close">&times;</button>
    
    <div class="modal-image">
      <div class="modal-image-content">
        <div class="modal-image-icon">👋</div>
        <h2>Content de te revoir !</h2>
        <p>Connecte-toi pour accéder à tes projets et opportunités</p>
      </div>
    </div>
    
    <div class="modal-form">
      <h2>Connexion</h2>
      <p>Accède à ton compte Marronner</p>
      
      <div class="social-buttons">
        <button class="social-btn" onclick="alert('Connexion Google (démo)')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continuer avec Google
        </button>
        
        <button class="social-btn" onclick="alert('Connexion Apple (démo)')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          Continuer avec Apple
        </button>
        
        <button class="social-btn" onclick="alert('Connexion Facebook (démo)')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Continuer avec Facebook
        </button>
      </div>
      
      <div class="divider">
        <span>OU</span>
      </div>
      
      <form id="loginForm">
        <div class="form-group">
          <label>Adresse email</label>
          <input type="email" required placeholder="ton.email@exemple.com">
        </div>
        
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" required placeholder="Ton mot de passe">
        </div>
        
        <button type="submit" class="submit-btn">Se connecter</button>
        
        <p class="terms">
          <a href="#">Mot de passe oublié ?</a>
        </p>
      </form>
      
      <div class="switch-auth">
        Pas encore de compte ? <a href="#" class="switch-to-signup">Inscris-toi</a>
      </div>
    </div>
  </div>
</div>
  `;
  
  // Insère les modales dans le DOM dès que possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.insertAdjacentHTML('beforeend', modalsHTML);
      console.log('✅ Modales chargées (inline)');
      initializeAuthModals();
      checkHashAndOpenModal();
    });
  } else {
    document.body.insertAdjacentHTML('beforeend', modalsHTML);
    console.log('✅ Modales chargées (inline)');
    initializeAuthModals();
    checkHashAndOpenModal();
  }
})();

// --- Animation d'apparition au scroll ---
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach(el => scrollObserver.observe(el));

// --- Mise en surbrillance du lien actif ---
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".menu a");

  links.forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active-link");
    }
  });
});

// --- Effet d'ombre sur le header au scroll ---
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 30) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// --- Animation de texte qui tape dans la barre de recherche ---
document.addEventListener("DOMContentLoaded", () => {
  // Animation typing sur la barre de recherche (si présente)
  const searchInput = document.querySelector('.search-bar input[type="text"]');
  if (searchInput) {
    const texts = [
      'Plombier',
      'Électricien',
      'Designer graphique',
      'Photographe',
      'Développeur web'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        searchInput.placeholder = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        searchInput.placeholder = currentText.substring(0, charIndex + 1);
        charIndex++;
      }
      
      let typeSpeed = isDeleting ? 50 : 100;
      
      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
      
      setTimeout(type, typeSpeed);
    }
    
    type();
  }

  // ============================================
  // GESTION ÉTAPES D'INSCRIPTION
  // ============================================
  // Gestion du bouton "S'inscrire par email"
  const emailSignupBtn = document.getElementById('emailSignupBtn');
  const backToStep1 = document.getElementById('backToStep1');
  
  if (emailSignupBtn) {
    emailSignupBtn.addEventListener('click', () => {
      document.querySelector('.signup-step-1').style.display = 'none';
      document.querySelector('.signup-step-2').style.display = 'block';
    });
  }

  if (backToStep1) {
    backToStep1.addEventListener('click', () => {
      document.querySelector('.signup-step-2').style.display = 'none';
      document.querySelector('.signup-step-1').style.display = 'block';
    });
  }
  
  // Les formulaires sont gérés par auth.js (avec Supabase)
});
// ============================================
// MENU BURGER MOBILE
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const burgerMenu = document.getElementById('burgerMenu');
  const mainMenu = document.getElementById('mainMenu');
  const body = document.body;
  
  if (burgerMenu && mainMenu) {
    // Toggle menu burger
    burgerMenu.addEventListener('click', () => {
      burgerMenu.classList.toggle('active');
      mainMenu.classList.toggle('active');
      body.classList.toggle('menu-open');
    });
    
    // Fermer le menu au clic sur un lien
    const menuLinks = mainMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        mainMenu.classList.remove('active');
        body.classList.remove('menu-open');
      });
    });
    
    // Fermer le menu au clic sur l'overlay
    body.addEventListener('click', (e) => {
      if (body.classList.contains('menu-open') && 
          !mainMenu.contains(e.target) && 
          !burgerMenu.contains(e.target)) {
        burgerMenu.classList.remove('active');
        mainMenu.classList.remove('active');
        body.classList.remove('menu-open');
      }
    });
  }
});
