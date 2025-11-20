// Script pour la page de publication de demande
// Vérification de l'authentification requise + champs dynamiques

console.log('📄 Script publish-demand.js chargé');

// Champs dynamiques selon la catégorie
const categoryFields = {
  'site-web': [
    { type: 'select', name: 'siteType', label: 'Type de site *', required: true, options: [
      { value: '', text: 'Sélectionner' },
      { value: 'vitrine', text: 'Site vitrine' },
      { value: 'ecommerce', text: 'E-commerce' },
      { value: 'blog', text: 'Blog' },
      { value: 'portfolio', text: 'Portfolio' },
      { value: 'application', text: 'Application web' }
    ]},
    { type: 'number', name: 'nbPages', label: 'Nombre de pages estimé', required: true, placeholder: 'Ex: 5' },
    { type: 'checkbox', name: 'features', label: 'Fonctionnalités souhaitées', options: [
      'Formulaire de contact',
      'Espace membre / Connexion',
      'Paiement en ligne',
      'Multilingue',
      'Blog intégré',
      'Responsive (mobile/tablette)'
    ]},
    { type: 'text', name: 'hosting', label: 'Hébergement existant ?', placeholder: 'Ex: OVH, AWS, ou à prévoir' }
  ],
  
  'graphisme': [
    { type: 'select', name: 'designType', label: 'Type de design *', required: true, options: [
      { value: '', text: 'Sélectionner' },
      { value: 'logo', text: 'Logo' },
      { value: 'flyer', text: 'Flyer / Affiche' },
      { value: 'carte-visite', text: 'Carte de visite' },
      { value: 'packaging', text: 'Packaging' },
      { value: 'identite', text: 'Identité visuelle complète' },
      { value: 'autre', text: 'Autre' }
    ]},
    { type: 'text', name: 'dimensions', label: 'Dimensions / Format', placeholder: 'Ex: A4, 1920x1080px, 10x15cm' },
    { type: 'select', name: 'fileFormat', label: 'Formats de fichiers souhaités', required: true, options: [
      { value: '', text: 'Sélectionner' },
      { value: 'pdf', text: 'PDF' },
      { value: 'jpg-png', text: 'JPG / PNG' },
      { value: 'ai-psd', text: 'AI / PSD (fichiers sources)' },
      { value: 'tous', text: 'Tous les formats' }
    ]},
    { type: 'textarea', name: 'stylePreference', label: 'Style graphique souhaité', placeholder: 'Ex: Moderne, épuré, coloré, vintage...' }
  ],
  
  'video': [
    { type: 'select', name: 'videoType', label: 'Type de vidéo *', required: true, options: [
      { value: '', text: 'Sélectionner' },
      { value: 'montage', text: 'Montage vidéo' },
      { value: 'animation', text: 'Animation / Motion design' },
      { value: 'publicitaire', text: 'Vidéo publicitaire' },
      { value: 'tutoriel', text: 'Tutoriel / Explicatif' },
      { value: 'evenement', text: 'Événement (mariage, anniversaire...)' }
    ]},
    { type: 'number', name: 'duration', label: 'Durée souhaitée (minutes)', placeholder: 'Ex: 2' },
    { type: 'select', name: 'videoFormat', label: 'Format de sortie', required: true, options: [
      { value: '', text: 'Sélectionner' },
      { value: 'mp4', text: 'MP4' },
      { value: 'mov', text: 'MOV' },
      { value: 'social', text: 'Optimisé réseaux sociaux (Instagram, TikTok...)' },
      { value: 'tous', text: 'Plusieurs formats' }
    ]},
    { type: 'checkbox', name: 'videoFeatures', label: 'Éléments à inclure', options: [
      'Sous-titres',
      'Musique de fond',
      'Voix off',
      'Effets spéciaux',
      'Intro / Outro',
      'Transitions animées'
    ]}
  ],
  
  'redaction': [
    { type: 'select', name: 'contentType', label: 'Type de contenu *', required: true, options: [
      { value: '', text: 'Sélectionner' },
      { value: 'article', text: 'Articles de blog' },
      { value: 'fiche-produit', text: 'Fiches produits' },
      { value: 'site-web', text: 'Contenu de site web' },
      { value: 'newsletter', text: 'Newsletter' },
      { value: 'reseaux-sociaux', text: 'Publications réseaux sociaux' },
      { value: 'communique', text: 'Communiqué de presse' }
    ]},
    { type: 'number', name: 'wordCount', label: 'Nombre de mots (par article)', placeholder: 'Ex: 500' },
    { type: 'number', name: 'nbArticles', label: 'Nombre d\'articles / contenus', placeholder: 'Ex: 10' },
    { type: 'text', name: 'keywords', label: 'Mots-clés SEO', placeholder: 'Ex: tourisme la réunion, restaurant créole...' },
    { type: 'select', name: 'tone', label: 'Ton souhaité', options: [
      { value: 'professionnel', text: 'Professionnel' },
      { value: 'decontracte', text: 'Décontracté / Friendly' },
      { value: 'technique', text: 'Technique' },
      { value: 'commercial', text: 'Commercial / Vendeur' }
    ]}
  ],
  
  'marketing': [
    { type: 'checkbox', name: 'marketingServices', label: 'Services marketing souhaités *', options: [
      'Gestion réseaux sociaux',
      'Publicité Facebook / Instagram',
      'Google Ads',
      'Stratégie de contenu',
      'Email marketing',
      'SEO / Référencement naturel',
      'Analyse et reporting'
    ]},
    { type: 'text', name: 'targetAudience', label: 'Public cible', placeholder: 'Ex: Particuliers 25-45 ans, entreprises locales...' },
    { type: 'text', name: 'competitors', label: 'Concurrents à analyser (optionnel)', placeholder: 'Noms ou sites web de concurrents' }
  ],
  
  'photo': [
    { type: 'select', name: 'photoType', label: 'Type de prestation *', required: true, options: [
      { value: '', text: 'Sélectionner' },
      { value: 'evenement', text: 'Événement (mariage, anniversaire...)' },
      { value: 'portrait', text: 'Portrait / Photo professionnelle' },
      { value: 'produit', text: 'Photo de produits' },
      { value: 'immobilier', text: 'Photo immobilière' },
      { value: 'paysage', text: 'Paysage / Architecture' }
    ]},
    { type: 'date', name: 'shootDate', label: 'Date de la séance photo', required: true },
    { type: 'text', name: 'location', label: 'Lieu', placeholder: 'Ex: Saint-Denis, Studio, à déterminer...' },
    { type: 'number', name: 'nbPhotos', label: 'Nombre de photos retouchées souhaitées', placeholder: 'Ex: 20' },
    { type: 'checkbox', name: 'photoOptions', label: 'Options', options: [
      'Retouches avancées',
      'Photos en haute résolution',
      'Livraison sur clé USB',
      'Album photo imprimé'
    ]}
  ],
  
  'dev-mobile': [
    { type: 'select', name: 'platform', label: 'Plateforme(s) *', required: true, options: [
      { value: '', text: 'Sélectionner' },
      { value: 'ios', text: 'iOS uniquement' },
      { value: 'android', text: 'Android uniquement' },
      { value: 'both', text: 'iOS + Android' },
      { value: 'pwa', text: 'Progressive Web App' }
    ]},
    { type: 'textarea', name: 'appFeatures', label: 'Fonctionnalités principales', placeholder: 'Listez les fonctionnalités essentielles de l\'application...' },
    { type: 'checkbox', name: 'techFeatures', label: 'Fonctionnalités techniques', options: [
      'Connexion utilisateur',
      'Notifications push',
      'Géolocalisation',
      'Paiement intégré',
      'Mode hors ligne',
      'API tierce (Facebook, Google...)'
    ]}
  ],
  
  'seo': [
    { type: 'text', name: 'website', label: 'URL du site web *', required: true, placeholder: 'https://...' },
    { type: 'textarea', name: 'targetKeywords', label: 'Mots-clés cibles', placeholder: 'Listez les mots-clés sur lesquels vous souhaitez vous positionner' },
    { type: 'checkbox', name: 'seoServices', label: 'Prestations SEO souhaitées', options: [
      'Audit SEO complet',
      'Optimisation on-page',
      'Netlinking / Backlinks',
      'Rédaction de contenu SEO',
      'Optimisation technique',
      'Suivi de positionnement'
    ]},
    { type: 'text', name: 'competitors', label: 'Concurrents (optionnel)', placeholder: 'Sites concurrents à analyser' }
  ],
  
  'formation': [
    { type: 'select', name: 'formationType', label: 'Type de formation *', required: true, options: [
      { value: '', text: 'Sélectionner' },
      { value: 'individuelle', text: 'Formation individuelle' },
      { value: 'groupe', text: 'Formation en groupe' },
      { value: 'en-ligne', text: 'Formation en ligne' },
      { value: 'presentiel', text: 'Formation en présentiel' }
    ]},
    { type: 'textarea', name: 'formationGoals', label: 'Objectifs de la formation', placeholder: 'Que souhaitez-vous apprendre ou maîtriser ?' },
    { type: 'text', name: 'skillLevel', label: 'Niveau actuel', placeholder: 'Ex: Débutant, Intermédiaire, Avancé' },
    { type: 'number', name: 'nbSessions', label: 'Nombre de sessions souhaitées', placeholder: 'Ex: 5' }
  ]
};

// Vérifier si l'utilisateur est connecté au chargement
(async () => {
  console.log('🔐 Vérification de l\'authentification...');
  
  const { data: { session } } = await supabase.auth.getSession();
  const loader = document.getElementById('authLoader');
  const loginRequired = document.getElementById('loginRequired');
  const publishForm = document.getElementById('publishForm');
  
  if (!session) {
    console.log('❌ Utilisateur non connecté');
    loader.style.display = 'none';
    loginRequired.style.display = 'block';
  } else {
    console.log('✅ Utilisateur connecté:', session.user.email);
    
    // Vérifier le type d'utilisateur
    const profileResult = await getUserProfile(session.user.id);
    
    if (profileResult.success && profileResult.data) {
      const userType = profileResult.data.user_type;
      
      if (userType !== 'chercheur') {
        // Si c'est un Marronneur, rediriger ou afficher un message
        loader.style.display = 'none';
        loginRequired.innerHTML = `
          <div class="container" style="padding: 100px 20px; text-align: center;">
            <div style="max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
              <div style="font-size: 4em; margin-bottom: 20px;">🚫</div>
              <h2 style="color: var(--primary); margin-bottom: 15px;">Accès réservé aux Chercheurs</h2>
              <p style="color: #6b7280; margin-bottom: 30px; font-size: 1.1em;">Seuls les Chercheurs peuvent publier des demandes. En tant que Marronneur, consultez les <a href="demandes.html" style="color: var(--secondary); font-weight: 600;">demandes ouvertes</a> pour postuler.</p>
              <a href="demandes.html" class="cta" style="display: inline-block; padding: 14px 32px; background: var(--secondary); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Voir les demandes</a>
            </div>
          </div>
        `;
        loginRequired.style.display = 'block';
        return;
      }
    }
    
    loader.style.display = 'none';
    publishForm.style.display = 'block';
  }
})();

// Gérer le changement de catégorie pour afficher les champs dynamiques
document.addEventListener('DOMContentLoaded', () => {
  const categorySelect = document.getElementById('demandCategory');
  const dynamicFieldsContainer = document.getElementById('dynamicFields');
  const demandTypeRadios = document.querySelectorAll('input[name="demandType"]');
  const marronneurSelection = document.getElementById('marronneurSelection');
  
  // Gérer l'affichage de la sélection de Marronneur
  demandTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'privee') {
        marronneurSelection.style.display = 'block';
        document.getElementById('marronneurSelect').required = true;
      } else {
        marronneurSelection.style.display = 'none';
        document.getElementById('marronneurSelect').required = false;
      }
    });
  });
  
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      const category = e.target.value;
      dynamicFieldsContainer.innerHTML = '';
      
      if (category && categoryFields[category]) {
        const fields = categoryFields[category];
        
        fields.forEach(field => {
          const fieldDiv = document.createElement('div');
          fieldDiv.style.marginBottom = '25px';
          
          const label = document.createElement('label');
          label.style.display = 'block';
          label.style.fontWeight = '600';
          label.style.marginBottom = '8px';
          label.style.color = 'var(--primary)';
          label.textContent = field.label;
          fieldDiv.appendChild(label);
          
          if (field.type === 'select') {
            const select = document.createElement('select');
            select.id = field.name;
            select.name = field.name;
            select.required = field.required || false;
            select.style.width = '100%';
            select.style.padding = '12px';
            select.style.border = '1px solid #e5e7eb';
            select.style.borderRadius = '8px';
            select.style.fontSize = '1em';
            
            field.options.forEach(opt => {
              const option = document.createElement('option');
              option.value = opt.value;
              option.textContent = opt.text;
              select.appendChild(option);
            });
            
            fieldDiv.appendChild(select);
          } else if (field.type === 'checkbox') {
            field.options.forEach(opt => {
              const checkDiv = document.createElement('div');
              checkDiv.style.marginBottom = '8px';
              
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.name = field.name;
              checkbox.value = opt;
              checkbox.id = `${field.name}_${opt.replace(/\s/g, '_')}`;
              checkbox.style.marginRight = '8px';
              
              const checkLabel = document.createElement('label');
              checkLabel.htmlFor = checkbox.id;
              checkLabel.textContent = opt;
              checkLabel.style.cursor = 'pointer';
              
              checkDiv.appendChild(checkbox);
              checkDiv.appendChild(checkLabel);
              fieldDiv.appendChild(checkDiv);
            });
          } else if (field.type === 'textarea') {
            const textarea = document.createElement('textarea');
            textarea.id = field.name;
            textarea.name = field.name;
            textarea.placeholder = field.placeholder || '';
            textarea.rows = 4;
            textarea.required = field.required || false;
            textarea.style.width = '100%';
            textarea.style.padding = '12px';
            textarea.style.border = '1px solid #e5e7eb';
            textarea.style.borderRadius = '8px';
            textarea.style.fontSize = '1em';
            textarea.style.resize = 'vertical';
            
            fieldDiv.appendChild(textarea);
          } else {
            const input = document.createElement('input');
            input.type = field.type;
            input.id = field.name;
            input.name = field.name;
            input.placeholder = field.placeholder || '';
            input.required = field.required || false;
            input.style.width = '100%';
            input.style.padding = '12px';
            input.style.border = '1px solid #e5e7eb';
            input.style.borderRadius = '8px';
            input.style.fontSize = '1em';
            
            if (field.type === 'number' && field.min !== undefined) {
              input.min = field.min;
            }
            
            fieldDiv.appendChild(input);
          }
          
          dynamicFieldsContainer.appendChild(fieldDiv);
        });
      }
    });
  }
  
  // Gérer la soumission du formulaire
  const form = document.getElementById('demandForm');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      console.log('📝 Soumission du formulaire de demande');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        showMessage('Vous devez être connecté pour publier une demande', 'error');
        return;
      }
      
      // Collecter toutes les données du formulaire
      const formData = new FormData(form);
      const demandData = {
        user_id: session.user.id,
        demand_type: formData.get('demandType'),
        category: document.getElementById('demandCategory').value,
        title: document.getElementById('demandTitle').value,
        description: document.getElementById('demandDescription').value,
        budget_min: parseFloat(document.getElementById('budgetMin').value),
        budget_max: parseFloat(document.getElementById('budgetMax').value),
        deadline: document.getElementById('demandDeadline').value,
        attachments: document.getElementById('demandAttachments').value,
        dynamic_fields: {},
        created_at: new Date().toISOString()
      };
      
      // Ajouter les champs dynamiques
      const dynamicInputs = document.querySelectorAll('#dynamicFields input, #dynamicFields select, #dynamicFields textarea');
      dynamicInputs.forEach(input => {
        if (input.type === 'checkbox') {
          if (!demandData.dynamic_fields[input.name]) {
            demandData.dynamic_fields[input.name] = [];
          }
          if (input.checked) {
            demandData.dynamic_fields[input.name].push(input.value);
          }
        } else {
          demandData.dynamic_fields[input.name] = input.value;
        }
      });
      
      // Si demande privée, ajouter le Marronneur cible
      if (demandData.demand_type === 'privee') {
        demandData.target_marronneur = document.getElementById('marronneurSelect').value;
      }
      
      console.log('📦 Données de la demande:', demandData);
      
      // TODO: Enregistrer dans Supabase (table demands à créer)
      showMessage('Demande publiée avec succès ! 🎉', 'success');
      
      // Rediriger vers le tableau de bord après 2 secondes
      setTimeout(() => {
        window.location.href = 'tableau-de-bord.html';
      }, 2000);
    });
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
