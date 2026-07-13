export default {
  mainMenu: {
    title: "Menu do Jogo",
    subtitle: "Bem-vindo à quinta!",
    description: "Explora a quinta, recolhe recursos e faz entregas para crescer o teu negócio.",
    start: "Começar",
    restart: "Reiniciar",
    language: "Idioma",

    descriptionTab: "Descrição",
    objectiveTitle: "Objetivo",
    objective: "O objetivo passa por cultivar diferentes tipos de fruta, colher as colheitas no momento certo e transformá-las em produtos valiosos para vender no mercado. Com o dinheiro ganho, podemos desbloquear novas áreas, melhorar estruturas, acelerar a produção e expandir a quinta até te tornares um verdadeiro mestre da agricultura e dos negócios.",
    guideTitle: "Como Jogar",
    locationsTitle: "Locais",

    sections: {
      movement: "Movimento",
      interaction: "Interação",
      inventory: "Inventário",
      quests: "Missões",
      shortcuts: "Atalhos",
      locations: "Entrar",
      menu: "Menu"
    },

    guide: {
      movement: "Usa WASD para mover.",
      interaction: "Usa F e E para interagir.",
      shortcuts: "Atalhos úteis: F e Esc.",
      locations: "Usa F para entrar nos locais.",
      menu: "Usa ESC para abrir o menu novamente."
    },

    locations: {
      farm: "Quinta",
      farmDesc: "O local onde tudo começa.",
      shop: "Loja de Upgrades",
      shopDesc: "Upgrade de itens essenciais.",
      sell: "Mercado",
      sellDesc: "Vende os teus produtos.",
      juicer: "Loja de Sementes",
      juicerDesc: "Compra de sementes.",
      barn: "Celeiro",
      barnDesc: "Armazena recursos.",
      hoverHint: "Passa o rato para ver interior"
    }
  },

  pause: {
    resume: "Jogar / Retomar",
    saveDownload: "Guardar",
    upload: "Carregar",
    footnote: "Obrigado por jogar!"
  },

  barnMenu: {
    title: "Bau do Celeiro",
    description: "Guarda ferramentas, sementes e colheitas para usar mais tarde.",
    close: "Fechar",
    sections: {
      seeds: "Sementes",
      harvest: "Produtos prontos a vender"
    },
    seedsProducts: {
      alface: "Sementes de Alface",
      cenoura: "Sementes de Cenoura",
      cebola: "Sementes de Cebola",
      morango: "Sementes de Morango",
      pepino: "Sementes de Pepino",
      batata: "Sementes de Batata",
      couve: "Sementes de Couve",
      melancia: "Sementes de Melancia"
    },
    harvestProducts: {
      alface: "Alface",
      cenoura: "Cenoura",
      cebola: "Cebola",
      morango: "Morango",
      pepino: "Pepino",
      batata: "Batata",
      couve: "Couve",
      melancia: "Melancia"
    }
  },

  seedMenu: {
    title: "Loja de Sementes",
    description: "Compra sementes para plantar na tua quinta.",
    close: "Fechar",
    buy: "Comprar",
    owned: "Compradas"
  },

  cabinMenu: {
    title: "Pedidos de Clientes",
    description: "Entrega os produtos colhidos para ganhar dinheiro.",
    close: "Fechar",
    empty: "Sem pedidos de momento",
    emptyHint: "Volta mais tarde para ver novos pedidos!",
    asking: "Quer",
    have: "Tens:",
    deliver: "Entregar",
    delivered: "Entregue",
    active: "pedidos ativos"
  },

  upgradeMenu: {
    title: "Loja de Upgrades",
    description: "Gasta o teu dinheiro em melhorias para a quinta e campos agrícolas.",
    close: "Fechar",
    buy: "Comprar"
  },

  fieldMenu: {
    title: "Campo Agrícola",
    description: "Planta sementes, espera que cresçam e depois colhe.",
    close: "Fechar",
    status: "Estado:",
    plant: "Plantar Sementes",
    harvest: "Colher",
    lockedAll: "Nenhuma semente desbloqueada — visita a Loja de Sementes.",
    units: "unidades colhidas",
    states: {
      empty: "Vazio",
      growing: "A crescer",
      ready: "Pronto a colher!"
    }
  }
};
