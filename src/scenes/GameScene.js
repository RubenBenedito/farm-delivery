import Phaser from 'phaser';
import { PLAYER_CONFIG } from '../player/playerConfig.js';
import { createPlayerAnimations } from '../player/playerAnimations.js';
import { updatePlayerMovement } from '../player/playerMovement.js';
import { createHUD, updateHUD } from '../ui/gameHud.js';
import { Barn } from '../objects/Barn.js';
import { SeedShop } from '../objects/SeedShop.js';
import { StoneCabin } from '../objects/StoneCabin.js';
import { UpgradeShop } from '../objects/UpgradeShop.js';
import { Field } from '../fields/Field.js';
import { FIELDS } from '../fields/fields.js';
import { PRODUCTS } from '../items/products.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.isPaused = false;
    }

    create() {
        // Dinheiro Inicial
        this.money = 50;

        // Inventário de sementes
        this.seeds = {};
        for (const id in PRODUCTS) {
            this.seeds[id] = PRODUCTS[id].defaultQuantity;
        }

        // Sementes compradas na loja
        this.purchasedSeeds = {};
        for (const id in PRODUCTS) {
            this.purchasedSeeds[id] = 0;
        }

        // Produtos colhidos
        this.harvest = {};
        for (const id in PRODUCTS) {
            this.harvest[id] = 0;
        }

        // Pedidos de clientes
        this.orders = [];

        // Upgrades
        this.unlockedItems = [];
        this.unlockedFields = [1, 2]; // field3, field4, field5 bloqueados


        // Colisão
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('summer_outdoorsTileSheet', 'juicetycoonmap');

        this.add.image(0, 0, 'juicetycoonmap').setOrigin(0, 0).setDepth(-1);

        const collisionLayer = map.createLayer('colision', tileset, 0, 0);
        collisionLayer.setVisible(false);
        collisionLayer.setCollisionByProperty({ collides: true });

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        const spawn = { x: 625, y: 774 };

        createPlayerAnimations(this);

        this.player = this.physics.add.sprite(spawn.x, spawn.y, 'player', 0);
        this.player.setScale(PLAYER_CONFIG.SCALE);
        this.player.setCollideWorldBounds(true);
        this.player.direction = 'down';

        // Colisão do player com o mapa
        this.physics.add.collider(this.player, collisionLayer);

        // Câmara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        createHUD(this, map.widthInPixels, map.heightInPixels);

        this.barn = new Barn(this, 500, 500);
        this.seedShop = new SeedShop(this, 1112, 696);
        this.stoneCabin = new StoneCabin(this, 791, 728);
        this.upgradeShop = new UpgradeShop(this, 840, 568);

        // Campos agrícolas
        this.fields = Object.values(FIELDS).map(config => new Field(this, config));

        // Pedidos na loja automaticamente
        this.time.addEvent({
            delay: 8000,
            callback: () => this.generateOrder(),
            loop: true
        });
    }

    generateOrder() {
        const items = Object.keys(PRODUCTS).filter(
            (id) => !PRODUCTS[id]?.locked || (this.unlockedItems ?? []).includes(id)
        );
        if (items.length === 0) return;

        const item = items[Math.floor(Math.random() * items.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;

        const prod = PRODUCTS[item];
        const base = prod?.buyPrice ?? 2;
        const [minSell, maxSell] = prod?.sellRange ?? [base * 2, base * 2 + 2];

        const safeMin = Math.max(minSell, base + 3);
        const safeMax = Math.max(safeMin, maxSell);
        const pricePerUnit = Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin;

        const MAX_ORDERS = 5;
        this.orders = this.orders.filter(o => !o.delivered);
        if (this.orders.length >= MAX_ORDERS) return;

        this.orders.push({
            id: Date.now(),
            item,
            quantity,
            pricePerUnit,
            delivered: false
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
            window.showGameMenu();
        }

        this.barn.update();
        this.seedShop.update();
        this.stoneCabin.update();
        this.upgradeShop.update();
        for (const field of this.fields) field.update();

        const interactables = [
            this.barn.interaction,
            this.seedShop.interaction,
            this.stoneCabin.interaction,
            this.upgradeShop.interaction,
            ...this.fields.map(f => f.interaction)
        ];

        interactables.some((i) => i.handleKeyF());

        if (!this.isPaused) {
            updatePlayerMovement(this, this.player);
        }

        updateHUD(this);
    }

    pauseGame() {
        this.isPaused = true;
        window.game?.scene?.pause?.('GameScene');
        window.pauseMusic?.();
    }

    resumeGame() {
        this.isPaused = false;
        if (window.game?.scene?.isPaused?.('GameScene')) {
            window.game.scene.resume('GameScene');
        }
        window.resumeMusic?.();
    }
}
