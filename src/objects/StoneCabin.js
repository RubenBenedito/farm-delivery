import { Interactable } from './Interactable.js';

export class StoneCabin {
    constructor(scene, x, y) {
        this.scene = scene;
        this.interaction = new Interactable(
            scene,
            x,     
            y,     
            32,     
            24,     
            () => {
                window.showStoneCabinMenu();
            }
        );
    }

    update() {
        this.interaction.update();
    }
}
