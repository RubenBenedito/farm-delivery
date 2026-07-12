import Phaser from 'phaser';

export class Interactable {
    constructor(scene, x, y, width, height, onInteract) {
        this.scene = scene;
        this.onInteract = onInteract;

        this.zone = new Phaser.Geom.Rectangle(
            x - width / 2,
            y - height / 2,
            width,
            height
        );

        this.keyF = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        this.showPrompt = false;
        this.enabled = true;
    }

    setEnabled(enabled) {
        this.enabled = !!enabled;
        if (!this.enabled && this.promptText) {
            this.promptText.setVisible(false);
            this.promptBg?.setVisible(false);
        }
    }


    update() {
        if (!this.enabled) {
            if (this.promptText) this.promptText.setVisible(false);
            if (this.promptBg) this.promptBg.setVisible(false);
            this.showPrompt = false;
            return;
        }

        this.showPrompt = Phaser.Geom.Intersects.RectangleToRectangle(
            this.scene.player.getBounds(),
            this.zone
        );

        if (this.showPrompt) {
            if (!this.promptText) {
                // Fundo escuro
                this.promptBg = this.scene.add.rectangle(
                    this.scene.player.x,
                    this.scene.player.y - 40,
                    28,
                    28,
                    0x000000,
                    0.75
                ).setOrigin(0.5).setDepth(999).setStrokeStyle(2, 0xffffff, 0.9);

                this.promptText = this.scene.add.text(
                    this.scene.player.x,
                    this.scene.player.y - 40,
                    "F",
                    {
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '20px',
                        fontStyle: 'bold',
                        color: '#ffffff',
                        stroke: '#000000',
                        strokeThickness: 4,
                        shadow: {
                            offsetX: 0,
                            offsetY: 2,
                            color: '#000000',
                            blur: 4,
                            stroke: true,
                            fill: true
                        }
                    }
                ).setOrigin(0.5).setDepth(1000);
            } else {
                this.promptBg.setPosition(this.scene.player.x, this.scene.player.y - 40);
                this.promptText.setPosition(this.scene.player.x, this.scene.player.y - 40);
                this.promptBg.setVisible(true);
                this.promptText.setVisible(true);
            }
        } else if (this.promptText) {
            this.promptText.setVisible(false);
            this.promptBg.setVisible(false);
        }
    }


    handleKeyF() {
        if (!this.enabled || !this.showPrompt) return false;
        if (Phaser.Input.Keyboard.JustDown(this.keyF)) {
            this.onInteract();
            return true;
        }
        return false;
    }
}
