// Configuration des frais de service Marronner pour les chercheurs
// Basé sur le modèle économique de la plateforme

const ServiceFeesConfig = {
  // Frais de service sur la commande principale
  orderFees: {
    threshold: 50, // Seuil en euros
    belowThreshold: {
      type: 'fixed',
      amount: 2 // 2€ pour commandes < 50€
    },
    aboveThreshold: {
      type: 'percentage',
      rate: 5.5 // 5,5% pour commandes ≥ 50€
    }
  },

  // Frais sur les pourboires (tips)
  tipsFees: {
    type: 'percentage',
    rate: 5.5 // 5,5% sur tous les tips
  },

  // Frais sur les options/extras
  extrasFees: {
    threshold: 50, // Même règle que la commande principale
    belowThreshold: {
      type: 'fixed',
      amount: 2 // 2€ si option < 50€
    },
    aboveThreshold: {
      type: 'percentage',
      rate: 5.5 // 5,5% si option ≥ 50€
    }
  },

  // Abonnement Business (optionnel)
  businessSubscription: {
    price: 149, // 149€/an
    currency: 'EUR',
    period: 'annual',
    benefits: [
      'Accès prioritaire aux marronneurs premium',
      'Support dédié 24/7',
      'Facturation centralisée',
      'Outils de gestion avancés',
      'Remises sur volumes'
    ]
  },

  // TVA
  vat: {
    rate: 8.5, // TVA La Réunion (8,5%)
    applicableOn: ['orderFees', 'tipsFees', 'extrasFees', 'subscription']
  }
};

// Fonction pour calculer les frais de service sur une commande
function calculateOrderFees(amount) {
  if (amount < ServiceFeesConfig.orderFees.threshold) {
    return {
      type: 'fixed',
      fees: ServiceFeesConfig.orderFees.belowThreshold.amount,
      calculation: `Frais fixes: ${ServiceFeesConfig.orderFees.belowThreshold.amount}€`
    };
  } else {
    const fees = (amount * ServiceFeesConfig.orderFees.aboveThreshold.rate) / 100;
    return {
      type: 'percentage',
      fees: parseFloat(fees.toFixed(2)),
      calculation: `${ServiceFeesConfig.orderFees.aboveThreshold.rate}% de ${amount}€`
    };
  }
}

// Fonction pour calculer les frais sur les tips
function calculateTipsFees(tipAmount) {
  if (tipAmount === 0) return { fees: 0, calculation: 'Aucun pourboire' };
  
  const fees = (tipAmount * ServiceFeesConfig.tipsFees.rate) / 100;
  return {
    fees: parseFloat(fees.toFixed(2)),
    calculation: `${ServiceFeesConfig.tipsFees.rate}% de ${tipAmount}€`
  };
}

// Fonction pour calculer les frais sur les extras
function calculateExtrasFees(extraAmount) {
  if (extraAmount === 0) return { fees: 0, calculation: 'Aucune option' };
  
  if (extraAmount < ServiceFeesConfig.extrasFees.threshold) {
    return {
      type: 'fixed',
      fees: ServiceFeesConfig.extrasFees.belowThreshold.amount,
      calculation: `Frais fixes: ${ServiceFeesConfig.extrasFees.belowThreshold.amount}€`
    };
  } else {
    const fees = (extraAmount * ServiceFeesConfig.extrasFees.aboveThreshold.rate) / 100;
    return {
      type: 'percentage',
      fees: parseFloat(fees.toFixed(2)),
      calculation: `${ServiceFeesConfig.extrasFees.aboveThreshold.rate}% de ${extraAmount}€`
    };
  }
}

// Fonction pour calculer la TVA
function calculateVAT(amount) {
  const vat = (amount * ServiceFeesConfig.vat.rate) / 100;
  return parseFloat(vat.toFixed(2));
}

// Fonction principale : calcul du total avec tous les frais
function calculateTotalWithFees(orderAmount, tipAmount = 0, extrasAmount = 0) {
  // Montant de base (ce que reçoit le marronneur)
  const baseAmount = orderAmount + extrasAmount;
  
  // Calcul des frais
  const orderFees = calculateOrderFees(orderAmount);
  const extrasFees = calculateExtrasFees(extrasAmount);
  const tipsFees = calculateTipsFees(tipAmount);
  
  // Total des frais de service
  const totalServiceFees = orderFees.fees + extrasFees.fees + tipsFees.fees;
  
  // TVA sur les frais de service
  const vatOnFees = calculateVAT(totalServiceFees);
  
  // Montant total payé par le chercheur
  const totalToPay = baseAmount + tipAmount + totalServiceFees + vatOnFees;
  
  return {
    breakdown: {
      orderAmount: orderAmount,
      extrasAmount: extrasAmount,
      tipAmount: tipAmount,
      baseAmount: baseAmount, // Ce que reçoit le marronneur
      serviceFees: {
        order: orderFees.fees,
        extras: extrasFees.fees,
        tips: tipsFees.fees,
        total: parseFloat(totalServiceFees.toFixed(2))
      },
      vat: vatOnFees,
      totalToPay: parseFloat(totalToPay.toFixed(2))
    },
    details: {
      orderFees: orderFees.calculation,
      extrasFees: extrasFees.calculation,
      tipsFees: tipsFees.calculation,
      vatCalculation: `TVA ${ServiceFeesConfig.vat.rate}% sur ${totalServiceFees.toFixed(2)}€ de frais`
    },
    marronneurReceives: baseAmount + tipAmount, // Marronneur reçoit le montant + tips (sans les frais)
    platformReceives: totalServiceFees + vatOnFees // Plateforme reçoit les frais + TVA
  };
}

// Fonction pour afficher un récapitulatif des frais
function displayFeesBreakdown(calculation) {
  return `
╔════════════════════════════════════════════════════╗
║         RÉCAPITULATIF DE LA COMMANDE              ║
╠════════════════════════════════════════════════════╣
║ Montant de la commande      │ ${calculation.breakdown.orderAmount.toFixed(2)} €
║ Options/Extras              │ ${calculation.breakdown.extrasAmount.toFixed(2)} €
║ Pourboire                   │ ${calculation.breakdown.tipAmount.toFixed(2)} €
╟────────────────────────────────────────────────────╢
║ Sous-total                  │ ${calculation.breakdown.baseAmount.toFixed(2)} €
╠════════════════════════════════════════════════════╣
║ FRAIS DE SERVICE                                   ║
╟────────────────────────────────────────────────────╢
║ • Frais commande            │ ${calculation.breakdown.serviceFees.order.toFixed(2)} €
║ • Frais extras              │ ${calculation.breakdown.serviceFees.extras.toFixed(2)} €
║ • Frais tips                │ ${calculation.breakdown.serviceFees.tips.toFixed(2)} €
║ Total frais service         │ ${calculation.breakdown.serviceFees.total.toFixed(2)} €
╟────────────────────────────────────────────────────╢
║ TVA (${ServiceFeesConfig.vat.rate}%)                    │ ${calculation.breakdown.vat.toFixed(2)} €
╠════════════════════════════════════════════════════╣
║ TOTAL À PAYER               │ ${calculation.breakdown.totalToPay.toFixed(2)} €
╚════════════════════════════════════════════════════╝

💰 Le marronneur recevra : ${calculation.marronneurReceives.toFixed(2)} €
🏢 Frais plateforme : ${calculation.platformReceives.toFixed(2)} €
  `;
}

// Export des fonctions et config
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ServiceFeesConfig,
    calculateOrderFees,
    calculateTipsFees,
    calculateExtrasFees,
    calculateVAT,
    calculateTotalWithFees,
    displayFeesBreakdown
  };
}
