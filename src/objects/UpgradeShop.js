import { Interactable } from './Interactable.js';

export class UpgradeShop {
    constructor(scene, x, y) {
        this.scene = scene;

        this.interaction = new Interactable(
            scene,
            x,
            y,
            32,
            24,
            () => {
                window.showUpgradeShopMenu();
            }
        );
    }

    update() {
        this.interaction.update();
    }
}
