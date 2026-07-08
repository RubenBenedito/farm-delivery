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
    }

    
    update() {
        this.showPrompt = Phaser.Geom.Intersects.RectangleToRectangle(
            this.scene.player.getBounds(),
            this.zone
        );

        if (this.showPrompt) {
            if (!this.promptText) {
                this.promptText = this.scene.add.text(
                    this.scene.player.x,
                    this.scene.player.y - 40,
                    "F",
                    { fontSize: "18px", color: "#fff", fontStyle: "bold" }
                ).setOrigin(0.5).setDepth(999);
            } else {
                this.promptText.setPosition(this.scene.player.x, this.scene.player.y - 40);
                this.promptText.setVisible(true);
            }
        } else {
            if (this.promptText) this.promptText.setVisible(false);
        }

        if (this.showPrompt && Phaser.Input.Keyboard.JustDown(this.keyF)) {
            this.onInteract();
        }
    }
}
