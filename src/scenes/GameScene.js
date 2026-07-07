import Phaser from 'phaser';
import { PLAYER_CONFIG } from '../player/playerConfig.js';
import { createPlayerAnimations } from '../player/playerAnimations.js';
import { updatePlayerMovement } from '../player/playerMovement.js';
import { createHUD, updateHUD } from '../ui/gameHud.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        const map = this.add.image(0, 0, 'mapImage').setOrigin(0);
        map.setDepth(-1);

        const MAP_WIDTH = map.width;
        const MAP_HEIGHT = map.height;

        this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

        const spawn = { x: 625, y: 774 };

        createPlayerAnimations(this);

        this.player = this.physics.add.sprite(spawn.x, spawn.y, 'player', 0);
        this.player.setScale(PLAYER_CONFIG.SCALE);
        this.player.setCollideWorldBounds(true);
        this.player.direction = 'down';

        this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        createHUD(this, MAP_WIDTH, MAP_HEIGHT);

        window.showGameMenu?.();
    }


    update() {
        updatePlayerMovement(this, this.player);

        updateHUD(this);
    }
}
