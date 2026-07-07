import Phaser from 'phaser';
import { PLAYER_CONFIG } from '../player/playerConfig.js';

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
    }

    preload() {
        this.cameras.main.setBackgroundColor('#ffffff');

        this.add.text(this.scale.width / 2, 100, "FARM DELIVERY", {
            fontSize: '48px',
            color: '#000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 160, "FARM", {
            fontSize: '32px',
            color: '#00aa00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 220, "A preparar a quinta...", {
            fontSize: '20px',
            color: '#000'
        }).setOrigin(0.5);

        // Barra de loading
        const barWidth = 400;
        const barHeight = 30;
        const x = (this.scale.width - barWidth) / 2;
        const y = 300;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();

        progressBox.fillStyle(0x222222, 0.3);
        progressBox.fillRect(x, y, barWidth, barHeight);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00aa00, 1);
            progressBar.fillRect(x, y, barWidth * value, barHeight);
        });

        this.load.on('complete', () => {
            this.time.delayedCall(500, () => {
                this.scene.start('GameScene');
            });
        });

        this.load.image('mapImage', 'assets/juicetycoonmap.png');
        this.load.spritesheet('player', 'assets/player.png', {
            frameWidth: PLAYER_CONFIG.FRAME_WIDTH,
            frameHeight: PLAYER_CONFIG.FRAME_HEIGHT
        });
    }
}
