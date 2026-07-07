import Phaser from 'phaser';
import { computed, createApp, defineComponent, h, ref } from 'vue';
import LoadingScene from './scenes/LoadingScene.js';
import GameScene from './scenes/GameScene.js';
import GameMenu from './components/GameMenu.vue';
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
        const open = ref(false);
        const language = ref('pt');
        const text = computed(() => LANGUAGES[language.value] ?? LANGUAGES.pt);

        const closeMenu = () => {
            open.value = false;
            game?.scene.resume('GameScene');
        };

        const restartGame = () => {
            game?.scene.stop('GameScene');
            game?.scene.start('GameScene');
            open.value = false;
        };

        const setLanguage = (lang) => {
            language.value = lang;
        };

        window.showGameMenu = () => {
            open.value = true;
            game?.scene.pause('GameScene');
        };

        window.hideGameMenu = closeMenu;

                return () => h(GameMenu, {
                        open: open.value,
                        language: language.value,
                        text: text.value,
                        onClose: closeMenu,
                        onRestart: restartGame,
                        onSetLanguage: setLanguage
                });
    },
});

createApp(MenuRoot).mount('#app');

game = new Phaser.Game(config);
window.game = game;
