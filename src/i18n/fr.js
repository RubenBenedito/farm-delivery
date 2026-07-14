export default {
  mainMenu: {
    title: "Menu du Jeu",
    subtitle: "Bienvenue à la ferme !",
    description: "Explorez la ferme, collectez des ressources et effectuez des livraisons pour développer votre entreprise.",
    start: "Commencer",
    restart: "Recommencer",
    language: "Langue",

    descriptionTab: "Description",
    objectiveTitle: "Objectif",
    objective:
      "L'objectif est de cultiver différents types de fruits, de les récolter au bon moment et de les transformer en produits précieux à vendre sur le marché. Avec l'argent que tu gagnes, tu peux débloquer de nouvelles zones, de nouveaux produits et agrandir la ferme jusqu'à devenir un véritable maître de l'agriculture et des affaires.",
    guideTitle: "Comment Jouer",
    locationsTitle: "Lieux",
    settingsTitle: "Paramètres",

    settings: {
      music: "Musique d'ambiance",
      step: "Bruit des pas",
      musicHint: "Réglez le volume de la musique d'ambiance qui tourne en boucle pendant le jeu.",
      stepHint: "Réglez le volume du son émis lorsque vous vous déplacez avec WASD."
    },

    sections: {
      movement: "Mouvement",
      interaction: "Interaction",
      inventory: "Inventaire",
      quests: "Quêtes",
      shortcuts: "Raccourcis",
      locations: "Entrer",
      menu: "Menu"
    },

    guide: {
      movement: "Utilisez WASD pour vous déplacer.",
      interaction: "Utilisez F ou E pour interagir.",
      shortcuts: "Raccourcis utiles : F et Échap.",
      locations: "Utilisez F pour entrer dans les lieux.",
      menu: "Utilisez Échap pour rouvrir le menu."
    },

  locations: {
    farm: "Ferme",
    farmDesc: "Là où tout commence.",
    shop: "Boutique d'Améliorations",
    shopDesc: "Améliorez les objets essentiels.",
    sell: "Marché",
    sellDesc: "Vendez vos produits.",
    juicer: "Boutique de Semences",
    juicerDesc: "Achetez des graines.",
    barn: "Grange",
    barnDesc: "Stockez vos ressources.",
    hoverHint: "Survolez pour voir l'intérieur"
  }
  },

  hud: {
    dayLabel: "JOUR"
  },

  pause: {
    resume: "Jouer / Reprendre",
    saveDownload: "Sauvegarder",
    upload: "Charger",
    footnote: "Merci d'avoir joué !"
  },

  barnMenu: {
    title: "Coffre de la Grange",
    description: "Rangez outils, graines et récoltes pour les utiliser plus tard.",
    close: "Fermer",
    sections: {
      seeds: "Graines",
      harvest: "Produits prêts à vendre"
    },
    seedsProducts: {
      alface: "Graines de Laitue",
      cenoura: "Graines de Carotte",
      cebola: "Graines d'Oignon",
      morango: "Graines de Fraise",
      pepino: "Graines de Concombre",
      batata: "Graines de Pomme de terre",
      couve: "Graines de Chou frisé",
      melancia: "Graines de Pastèque"
    },
    harvestProducts: {
      alface: "Laitue",
      cenoura: "Carotte",
      cebola: "Oignon",
      morango: "Fraise",
      pepino: "Concombre",
      batata: "Pomme de terre",
      couve: "Chou frisé",
      melancia: "Pastèque"
    }
  },

  seedMenu: {
    title: "Boutique de Semences",
    description: "Achetez des graines à planter sur votre ferme.",
    close: "Fermer",
    buy: "Acheter",
    owned: "Acheté"
  },

  cabinMenu: {
    title: "Commandes des Clients",
    description: "Livrez les produits récoltés pour gagner de l'argent.",
    close: "Fermer",
    empty: "Aucune commande actuellement",
    emptyHint: "Revenez plus tard pour de nouvelles commandes !",
    asking: "Veut",
    have: "Vous avez :",
    deliver: "Livrer",
    delivered: "Livré",
    active: "commandes actives"
  },

  upgradeMenu: {
    title: "Boutique d'Améliorations",
    description: "Dépensez vos pièces pour améliorer votre ferme et vos champs.",
    close: "Fermer",
    buy: "Acheter"
  },

  fieldMenu: {
    title: "Champ",
    description: "Plantez des graines, attendez qu'elles poussent, puis récoltez.",
    close: "Fermer",
    status: "État :",
    plant: "Planter des Graines",
    harvest: "Récolter",
    lockedAll: "Aucune graine débloquée — visitez la Boutique de Semences.",
    units: "unités récoltées",
    states: {
      empty: "Vide",
      growing: "En croissance",
      ready: "Prêt à récolter !"
    }
  }
};
