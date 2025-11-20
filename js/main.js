console.log("Marronner – site chargé avec succès !");

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
  // GESTION MODAUX INSCRIPTION / CONNEXION
  // ============================================
  
  const signupModal = document.getElementById('signupModal');
  const loginModal = document.getElementById('loginModal');
  
  // Fonction pour ouvrir un modal
  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Fonction pour fermer un modal
  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
  
  // Intercepter les clics sur liens "S'inscrire" et "Connexion"
  document.querySelectorAll('a[href="inscription.html"], a[href*="inscription"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(signupModal);
    });
  });
  
  document.querySelectorAll('a[href="connexion.html"], a[href*="connexion"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
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
