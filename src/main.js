import Phaser from 'phaser';
import { computed, createApp, defineComponent, h, ref } from 'vue';
import LoadingScene from './scenes/LoadingScene.js';
import GameScene from './scenes/GameScene.js';
import GameMenu from './components/GameMenu.vue';
import BarnMenu from './components/BarnMenu.vue';
import SeedShopMenu from './components/SeedShopMenu.vue';
import StoneCabinMenu from './components/StoneCabinMenu.vue';
import { LANGUAGES } from './i18n/index.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [LoadingScene, GameScene],

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

let game = null;

const MenuRoot = defineComponent({
    setup() {
        const pauseOpen = ref(false);
        const barnOpen = ref(false);
        const seedShopOpen = ref(false);
        const cabinOpen = ref(false);

        const language = ref('pt');
        const text = computed(() => LANGUAGES[language.value] ?? LANGUAGES.pt);

        const closePauseMenu = () => {
            pauseOpen.value = false;
            const scene = game.scene.getScene('GameScene');
            scene.resumeGame();
        };

        const restartGame = () => {
            pauseOpen.value = false;
            const scene = game.scene.getScene('GameScene');
            scene.isPaused = false;
            game.scene.stop('GameScene');
            game.scene.start('GameScene');
        };

        const setLanguage = (lang) => {
            language.value = lang;
        };

        window.showGameMenu = () => {
            barnOpen.value = false;
            seedShopOpen.value = false;
            cabinOpen.value = false;
            pauseOpen.value = true;

            const scene = game.scene.getScene('GameScene');
            scene.pauseGame();
        };

        window.hideGameMenu = closePauseMenu;


        // Menu Celeiro
        window.showBarnMenu = () => {
            pauseOpen.value = false;
            seedShopOpen.value = false;
            cabinOpen.value = false;
            barnOpen.value = true;

            const scene = game.scene.getScene('GameScene');
            scene.pauseGame();
        };

        window.hideBarnMenu = () => {
            barnOpen.value = false;
            const scene = game.scene.getScene('GameScene');
            scene.resumeGame();
        };


        // Menu Loja de Sementes
        window.showSeedShopMenu = () => {
            pauseOpen.value = false;
            barnOpen.value = false;
            cabinOpen.value = false;
            seedShopOpen.value = true;

            const scene = game.scene.getScene('GameScene');
            scene.pauseGame();
        };

        window.hideSeedShopMenu = () => {
            seedShopOpen.value = false;
            const scene = game.scene.getScene('GameScene');
            scene.resumeGame();
        };


        // Menu Pedidos de Clientes
        window.showStoneCabinMenu = () => {
            pauseOpen.value = false;
            barnOpen.value = false;
            seedShopOpen.value = false;
            cabinOpen.value = true;

            const scene = game.scene.getScene('GameScene');
            scene.pauseGame();
        };

        window.hideStoneCabinMenu = () => {
            cabinOpen.value = false;
            const scene = game.scene.getScene('GameScene');
            scene.resumeGame();
        };


        return () => [
            pauseOpen.value
                ? h(GameMenu, {
                      open: pauseOpen.value,
                      language: language.value,
                      text: text.value,
                      onClose: closePauseMenu,
                      onRestart: restartGame,
                      onSetLanguage: setLanguage
                  })
                : null,

            barnOpen.value
                ? h(BarnMenu, {
                      open: barnOpen.value,
                      text: text.value,
                      onClose: window.hideBarnMenu
                  })
                : null,

            seedShopOpen.value
                ? h(SeedShopMenu, {
                      open: seedShopOpen.value,
                      text: text.value,
                      onClose: window.hideSeedShopMenu
                  })
                : null,

            cabinOpen.value
                ? h(StoneCabinMenu, {
                      open: cabinOpen.value,
                      text: text.value,
                      onClose: window.hideStoneCabinMenu
                  })
                : null
        ];
    },
});

createApp(MenuRoot).mount('#app');

game = new Phaser.Game(config);
window.game = game;
