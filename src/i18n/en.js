export default {
  mainMenu: {
    title: "Game Menu",
    subtitle: "Welcome to the farm!",
    description: "Explore the farm, gather resources, and complete deliveries to grow your business.",
    start: "Start",
    restart: "Restart",
    language: "Language",

    descriptionTab: "Description",
    objectiveTitle: "Goal",
    objective:
      "The objective is to cultivate different types of fruit, harvest them at the right moment, and transform them into valuable products to sell on the market. With the money you earn, you can unlock new areas, new products, and expand the farm until you become a true master of farming and business.",
    guideTitle: "How to Play",
    locationsTitle: "Locations",

    sections: {
      movement: "Movement",
      interaction: "Interaction",
      inventory: "Inventory",
      quests: "Quests",
      shortcuts: "Shortcuts",
      locations: "Enter",
      menu: "Menu"
    },

    guide: {
      movement: "Use WASD to move.",
      interaction: "Use F and E to interact.",
      shortcuts: "Useful shortcuts: F and Esc.",
      locations: "Use F to enter locations.",
      menu: "Use ESC to open the menu again."
    },

  locations: {
    farm: "Farm",
    farmDesc: "Where everything begins.",
    shop: "Upgrade Shop",
    shopDesc: "Upgrade essential items.",
    sell: "Market",
    sellDesc: "Sell your products.",
    juicer: "Seed Shop",
    juicerDesc: "Buy seeds.",
    barn: "Barn",
    barnDesc: "Store resources.",
    hoverHint: "Hover to see interior"
  }
  },

  hud: {
    dayLabel: "DAY"
  },

  pause: {
    resume: "Play / Resume",
    saveDownload: "Save",
    upload: "Upload",
    footnote: "Thanks for playing!"
  },

  barnMenu: {
    title: "Barn Chest",
    description: "Stow tools, seeds and harvests to use later.",
    close: "Close",
    sections: {
      seeds: "Seeds",
      harvest: "Products ready to sell"
    },
    seedsProducts: {
      alface: "Lettuce Seeds",
      cenoura: "Carrot Seeds",
      cebola: "Onion Seeds",
      morango: "Strawberry Seeds",
      pepino: "Cucumber Seeds",
      batata: "Potato Seeds",
      couve: "Kale Seeds",
      melancia: "Watermelon Seeds"
    },
    harvestProducts: {
      alface: "Lettuce",
      cenoura: "Carrot",
      cebola: "Onion",
      morango: "Strawberry",
      pepino: "Cucumber",
      batata: "Potato",
      couve: "Kale",
      melancia: "Watermelon"
    }
  },

  seedMenu: {
    title: "Seed Shop",
    description: "Buy seeds to plant on your farm.",
    close: "Close",
    buy: "Buy",
    owned: "Owned"
  },

  cabinMenu: {
    title: "Customer Orders",
    description: "Deliver harvested products to earn money.",
    close: "Close",
    empty: "No orders right now",
    emptyHint: "Come back later for new orders!",
    asking: "Wants",
    have: "You have:",
    deliver: "Deliver",
    delivered: "Delivered",
    active: "active orders"
  },

  upgradeMenu: {
    title: "Upgrade Shop",
    description: "Spend your coins on improvements to your farm and fields.",
    close: "Close",
    buy: "Buy"
  },

  fieldMenu: {
    title: "Field",
    description: "Plant seeds, wait for them to grow, then harvest.",
    close: "Close",
    status: "Status:",
    plant: "Plant Seeds",
    harvest: "Harvest",
    lockedAll: "No seeds unlocked yet — visit the Seed Shop.",
    units: "units harvested",
    states: {
      empty: "Empty",
      growing: "Growing",
      ready: "Ready to harvest!"
    }
  }
};
