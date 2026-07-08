import { Interactable } from './Interactable.js';

export class Barn {
    constructor(scene, x, y) {
        this.scene = scene;

        this.interaction = new Interactable(
            scene,
            x,      // centro do celeiro
            y + 10, // frente da porta 
            50,    // largura
            10,     // altura
            () => {
                window.showBarnMenu();
            }
        );
    }

    update() {
        this.interaction.update();
    }
}
