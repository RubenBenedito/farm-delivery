import { Interactable } from './Interactable.js';

export class SeedShop {
    constructor(scene, x, y) {
        this.scene = scene;

        this.interaction = new Interactable(
            scene,
            x,
            y + 10,
            30, 
            40, 
            () => {
                window.showSeedShopMenu();
            }
        );
    }

    update() {
        this.interaction.update();
    }
}
