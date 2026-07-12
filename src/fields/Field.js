import { Interactable } from '../objects/Interactable.js';
import { FIELDS } from './fields.js';
import { PRODUCTS } from '../items/products.js';

export class Field {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;

        this.id = config.id;
        this.x = config.x;
        this.y = config.y;
        this.width = config.width ?? 120;
        this.height = config.height ?? 120;

        this.state = config.state ?? 'empty';
        this.seedType = config.seedType ?? null;
        this.timeLeft = config.timeLeft ?? 0;

        // Letra "F"
        this.interaction = new Interactable(
            scene,
            this.x,
            this.y,
            this.width,
            this.height,
            () => window.showFieldMenu?.(this.id)
        );

        // Campo Bloqueado a cinzento
        const initiallyLocked = !scene.unlockedFields?.includes(this.id);
        this.lockOverlay = scene.add
            .rectangle(this.x, this.y, this.width, this.height, 0x808080, 0.55)
            .setOrigin(0.5)
            .setDepth(-0.5)
            .setVisible(initiallyLocked);

        this._wasLocked = initiallyLocked;
    }

    update() {
        // Não mostra "F" em campos bloqueados
        const unlocked = this.scene.unlockedFields?.includes(this.id);
        this.interaction.setEnabled(!!unlocked);

        if (unlocked !== !this._wasLocked) {
            this.lockOverlay.setVisible(!unlocked);
            this._wasLocked = !unlocked;
        }

        if (unlocked) {
            this.interaction.update();

            // Crescimento
            if (this.state === 'growing') {
                this.timeLeft -= this.scene.game.loop.delta;
                if (this.timeLeft <= 0) {
                    this.state = 'ready';
                    this.timeLeft = 0;
                }
            }
        }
    }

    plant(seedType) {
        const cost = FIELDS[this.id].seedCost;
        if ((this.scene.seeds?.[seedType] ?? 0) < cost) return false;

        this.scene.seeds[seedType] -= cost;
        this.seedType = seedType;
        this.state = 'growing';
        this.timeLeft = PRODUCTS[seedType].growTime;
        return true;
    }

    harvest() {
        if (this.state !== 'ready') return 0;

        const cost = FIELDS[this.id].seedCost;
        const yieldPerSeed = PRODUCTS[this.seedType]?.yield ?? 1;
        const total = cost * yieldPerSeed;

        this.scene.harvest[this.seedType] =
            (this.scene.harvest[this.seedType] ?? 0) + total;

        this.state = 'empty';
        this.seedType = null;
        this.timeLeft = 0;
        return total;
    }
}
