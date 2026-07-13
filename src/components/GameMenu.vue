<script setup>
import { ref } from 'vue';
import Description from './Description.vue';
import HowToPlay from './HowToPlay.vue';
import Locations from './Locations.vue';

defineProps({
	open: Boolean,
	language: String,
	text: Object
});

const emit = defineEmits(['close', 'restart', 'set-language']);
const tab = ref('description');

function setLang(lang) {
	emit('set-language', lang);
}


function resumeGame() {
    const game = window.game;
    const scene = game.scene.getScene('GameScene');
    const isPaused = scene?.scene?.isPaused?.('GameScene');
    const isActive = scene?.scene?.isActive?.('GameScene');

    if (!scene || (!isPaused && !isActive)) {
        if (scene) scene.isPaused = false;
        game.scene.start('GameScene');
    } else if (isPaused) {
        scene.resumeGame();
    } else {
        scene.isPaused = false;
    }

    emit('close');
}

</script>


<template>
	<div class="menu-overlay" :class="{ 'is-open': open }">
		<div class="menu-frame">
			<aside class="menu-sidebar">
				<div class="menu-vine"></div>

				<section class="menu-language-panel">
					<div class="menu-side-title">{{ text.mainMenu.language }}</div>

					<div class="menu-language-buttons">
						<button class="menu-chip" :class="{ 'is-active': language === 'pt' }" @click="setLang('pt')">
							Português
						</button>
						<button class="menu-chip" :class="{ 'is-active': language === 'en' }" @click="setLang('en')">
							English
						</button>
						<button class="menu-chip" :class="{ 'is-active': language === 'fr' }" @click="setLang('fr')">
							Français
						</button>
					</div>
				</section>
                

				<div class="menu-actions">
                    <button class="menu-btn is-primary" @click="resumeGame">
                        {{ text.pause.resume }}
                    </button>
					<button class="menu-btn" @click="emit('restart')">
						{{ text.mainMenu.restart }}
					</button>
				</div>
			</aside>

			<main class="menu-content">
				<div class="menu-tabs">
					<button class="menu-tab" :class="{ 'is-active': tab === 'description' }" @click="tab = 'description'">
						{{ text.mainMenu.descriptionTab }}
					</button>
					<button class="menu-tab" :class="{ 'is-active': tab === 'howto' }" @click="tab = 'howto'">
						{{ text.mainMenu.guideTitle }}
					</button>
					<button class="menu-tab" :class="{ 'is-active': tab === 'locations' }" @click="tab = 'locations'">
						{{ text.mainMenu.locationsTitle }}
					</button>
				</div>

				<header class="menu-header">
					<h1>{{ text.mainMenu.title }}</h1>
					<p class="menu-subtitle">{{ text.mainMenu.subtitle }}</p>
				</header>

				<Description v-if="tab === 'description'" :text="text" />
				<HowToPlay v-else-if="tab === 'howto'" :text="text" />
				<Locations v-else :text="text" />
			</main>
		</div>
	</div>
</template>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Press+Start+2P&display=swap');

.menu-overlay,
.menu-overlay * {
	box-sizing: border-box;
}

.menu-overlay {
	position: fixed;
	inset: 0;
	z-index: 9999;
	display: grid;
	place-items: center;
	opacity: 0;
	visibility: hidden;
	transition: opacity 160ms ease, visibility 160ms ease;
	background:
		radial-gradient(circle at 16% 16%, rgba(66, 131, 81, 0.3), transparent 34%),
		radial-gradient(circle at 86% 82%, rgba(214, 154, 55, 0.18), transparent 36%),
		rgba(4, 8, 7, 0.72);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	font-family: 'Outfit', sans-serif;
	padding: 16px;
}

.menu-overlay.is-open {
	opacity: 1;
	visibility: visible;
}

.menu-frame {
	width: min(1000px, 100%);
	height: min(92vh, 760px);
	border-radius: 24px;
	border: 1px solid rgba(201, 150, 84, 0.35);
	background: linear-gradient(180deg, rgba(4, 8, 26, 0.98), rgba(2, 6, 18, 0.98));
	box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
	display: grid;
	grid-template-columns: 320px minmax(0, 1fr);
	overflow: hidden;
}

.menu-sidebar {
	border-right: 1px solid rgba(201, 150, 84, 0.2);
	padding: 26px;
	display: grid;
	align-content: start;
	gap: 18px;
}

.menu-vine {
	height: 5px;
	border-radius: 999px;
	background: linear-gradient(90deg, transparent 0%, rgba(174, 211, 120, 0.45) 45%, transparent 100%);
}

.menu-compass {
	width: 72px;
	height: 72px;
	margin: 2px auto 8px;
	border-radius: 50%;
	display: grid;
	place-items: center;
	font-family: 'Press Start 2P', monospace;
	font-size: 1rem;
	color: #40250f;
	background: radial-gradient(circle at 30% 30%, #f8edd5, #d8b480 68%, #966844 100%);
	border: 2px solid rgba(93, 62, 33, 0.45);
}

.menu-language-panel {
	border-radius: 16px;
	padding: 14px;
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(201, 150, 84, 0.28);
}

.menu-side-title {
	text-transform: uppercase;
	letter-spacing: 0.14em;
	color: rgba(222, 202, 165, 0.7);
	text-align: center;
	font-weight: 700;
	margin-bottom: 10px;
}

.menu-language-buttons,
.menu-actions {
	display: grid;
	gap: 10px;
}

.menu-chip,
.menu-btn,
.menu-tab {
	border-radius: 14px;
	border: 1px solid rgba(191, 144, 79, 0.35);
	min-height: 46px;
	font-weight: 800;
	letter-spacing: 0.02em;
	cursor: pointer;
	transition: transform 120ms ease, filter 120ms ease, border-color 120ms ease;
}

.menu-chip {
	background: linear-gradient(180deg, rgba(23, 28, 45, 0.9), rgba(18, 22, 34, 0.9));
	color: #dbcfb5;
}

.menu-chip.is-active {
	background: linear-gradient(135deg, rgba(71, 122, 52, 0.85), rgba(35, 68, 36, 0.9));
	color: #caec9f;
	border-color: rgba(157, 216, 126, 0.56);
}

.menu-btn {
	background: linear-gradient(180deg, rgba(21, 26, 40, 0.88), rgba(14, 18, 30, 0.92));
	color: #cfc3aa;
}

.menu-btn.is-primary {
	background: linear-gradient(135deg, rgba(98, 150, 69, 0.85), rgba(41, 78, 39, 0.9));
	border-color: rgba(157, 216, 126, 0.56);
	color: #d8f4b0;
}

.menu-btn.is-muted {
	opacity: 0.9;
}

.menu-chip:hover,
.menu-btn:hover,
.menu-tab:hover {
	transform: translateY(-1px);
	filter: brightness(1.06);
}

.menu-content {
	padding: 22px 28px;
	overflow: auto;
}

.menu-tabs {
	display: flex;
	gap: 8px;
	border-bottom: 1px solid rgba(201, 150, 84, 0.25);
	padding-bottom: 0;
}

.menu-tab {
	border-radius: 12px 12px 0 0;
	min-width: 150px;
	background: linear-gradient(180deg, rgba(71, 45, 28, 0.85), rgba(50, 32, 20, 0.9));
	color: #ead6b0;
	border-bottom: 0;
}

.menu-tab.is-active {
	background: linear-gradient(180deg, rgba(124, 80, 45, 0.9), rgba(78, 52, 31, 0.95));
}

.menu-header {
	text-align: center;
	padding: 16px 8px 20px;
}

.menu-header h1 {
	margin: 0;
	font-family: 'Press Start 2P', monospace;
	font-size: clamp(1.3rem, 3.5vw, 2.2rem);
	color: #eddcb7;
}

.menu-subtitle {
	margin: 10px 0 0;
	color: rgba(228, 215, 191, 0.76);
	font-size: 1.02rem;
}

@media (max-width: 980px) {
	.menu-frame {
		grid-template-columns: 1fr;
		height: min(94vh, 860px);
	}

	.menu-sidebar {
		border-right: 0;
		border-bottom: 1px solid rgba(201, 150, 84, 0.25);
	}
}
</style>
