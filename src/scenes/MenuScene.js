import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#ffffff');

        this.add.text(this.scale.width / 2, 100, "Juice", {
            fontSize: '48px',
            color: '#000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 160, "Uma pequena aventura numa quinta.", {
            fontSize: '20px',
            color: '#444',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        this.createButton("JOGAR", 260, () => {
            this.scene.start('GameScene');
        });
    }


    createButton(text, y, callback) {
        const btn = this.add.text(this.scale.width / 2, y, text, {
            fontSize: '28px',
            color: '#000',
            backgroundColor: '#e0e0e0',
            padding: { left: 20, right: 20, top: 10, bottom: 10 }
        }).setOrigin(0.5).setInteractive();

        btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#cccccc' }));
        btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#e0e0e0' }));
        btn.on('pointerdown', callback);
    }
}
