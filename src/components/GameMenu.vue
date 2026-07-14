<script setup>
import { computed, ref } from 'vue';
import Description from './Description.vue';
import HowToPlay from './HowToPlay.vue';
import Locations from './Locations.vue';
import SettingsPanel from './SettingsPanel.vue';

const props = defineProps({
	open: Boolean,
	language: String,
	text: Object,
	musicVolume: Number,
	stepVolume: Number,
	settings: Object,
	defaults: Object
});

const emit = defineEmits([
	'close', 'restart', 'set-language',
	'change-music', 'change-step'
]);
const tab = ref('description');

function setLang(lang) {
	emit('set-language', lang);
}

const tabLabels = computed(() => ({
	description: props.text.mainMenu.descriptionTab,
	howto: props.text.mainMenu.guideTitle,
	locations: props.text.mainMenu.locationsTitle,
	settings: props.text.mainMenu.settingsTitle
}));

const activeTabLabel = computed(() => tabLabels.value[tab.value]);

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

				<header class="sidebar-header">
					<div class="sidebar-title">
						<span>Farm Delivery</span>
					</div>
				</header>


				<section class="language-panel">
					<div class="panel-label">
						<span class="panel-pin" aria-hidden="true"></span>
						<span>{{ text.mainMenu.language }}</span>
					</div>
					<div class="language-buttons">
						<button class="lang-btn" :class="{ 'is-active': language === 'pt' }" @click="setLang('pt')">
							<span class="lang-mark">PT</span>
							<span class="lang-name">Português</span>
						</button>
						<button class="lang-btn" :class="{ 'is-active': language === 'en' }" @click="setLang('en')">
							<span class="lang-mark">EN</span>
							<span class="lang-name">English</span>
						</button>
						<button class="lang-btn" :class="{ 'is-active': language === 'fr' }" @click="setLang('fr')">
							<span class="lang-mark">FR</span>
							<span class="lang-name">Français</span>
						</button>
					</div>
				</section>

				<div class="sidebar-actions">
					<button class="stamp-btn is-primary" @click="resumeGame">
						<span class="stars" aria-hidden="true">✦ ✦ ✦</span>
						<span>{{ text.pause.resume }}</span>
					</button>
					<button class="stamp-btn" @click="emit('restart')">
						<span class="arrow" aria-hidden="true">↺</span>
						<span>{{ text.mainMenu.restart }}</span>
					</button>
				</div>

			</aside>


			<main class="menu-content">

				<div class="page-header">
					<div class="menu-tabs" role="tablist">
						<button class="menu-tab" :class="{ 'is-active': tab === 'description' }" @click="tab = 'description'">
							<span class="tab-bullet" aria-hidden="true">❀</span>
							{{ text.mainMenu.descriptionTab }}
						</button>
						<button class="menu-tab" :class="{ 'is-active': tab === 'howto' }" @click="tab = 'howto'">
							<span class="tab-bullet" aria-hidden="true">✦</span>
							{{ text.mainMenu.guideTitle }}
						</button>
					<button class="menu-tab" :class="{ 'is-active': tab === 'locations' }" @click="tab = 'locations'">
						<span class="tab-bullet" aria-hidden="true">❖</span>
						{{ text.mainMenu.locationsTitle }}
					</button>
					<button class="menu-tab" :class="{ 'is-active': tab === 'settings' }" @click="tab = 'settings'">
						<span class="tab-bullet" aria-hidden="true">⚙</span>
						{{ text.mainMenu.settingsTitle }}
					</button>
				</div>
				</div>

				<header class="menu-header">
					<h1 class="handwritten">{{ text.mainMenu.title }}</h1>
					<p class="menu-subtitle">— {{ text.mainMenu.subtitle }} —</p>
					<div class="ink-line"></div>
				</header>

			<div class="content-scroll">
				<Description v-if="tab === 'description'" :text="text" />
				<HowToPlay v-else-if="tab === 'howto'" :text="text" />
				<Locations v-else-if="tab === 'locations'" :text="text" />
				<SettingsPanel
					v-else-if="tab === 'settings'"
					:text="text"
					:music-volume="musicVolume" :step-volume="stepVolume"
					@change-music="emit('change-music', $event)"
					@change-step="emit('change-step', $event)"
				/>
			</div>

			</main>

			<div class="washi-tape washi-tape--left" aria-hidden="true"></div>
			<div class="washi-tape washi-tape--right" aria-hidden="true"></div>

		</div>
	</div>
</template>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.menu-overlay,
.menu-overlay * { box-sizing: border-box; }

.menu-overlay {
	position: fixed;
	inset: 0;
	z-index: 9999;
	display: grid;
	place-items: center;
	opacity: 0;
	visibility: hidden;
	transition: opacity 260ms ease, visibility 260ms ease;
	background:
		radial-gradient(ellipse at 50% 45%, rgba(232, 200, 130, 0.20), transparent 60%),
		radial-gradient(circle at 10% 92%, rgba(58, 32, 12, 0.55), transparent 32%),
		radial-gradient(circle at 92% 8%, rgba(58, 32, 12, 0.50), transparent 32%),
		rgba(20, 12, 6, 0.62);
	backdrop-filter: blur(6px) sepia(0.35);
	-webkit-backdrop-filter: blur(6px) sepia(0.35);
	font-family: 'Crimson Pro', 'Georgia', serif;
	padding: 16px;
}

.menu-overlay.is-open {
	opacity: 1;
	visibility: visible;
}

.menu-frame {
	position: relative;
	width: min(1040px, 100%);
	height: min(92vh, 780px);
	border-radius: 6px 26px 26px 6px;
	background:
		repeating-linear-gradient(
			to bottom,
			transparent 0,
			transparent 27px,
			rgba(143, 98, 49, 0.16) 27px,
			rgba(143, 98, 49, 0.16) 28px
		),
		radial-gradient(ellipse at 22% 16%, #fdf6e1 0%, #f0e1b6 38%, #dcbf85 100%);
	box-shadow:
		0 30px 80px rgba(0, 0, 0, 0.5),
		0 0 0 1px rgba(58, 32, 12, 0.4),
		inset 0 0 80px rgba(94, 60, 26, 0.20);
	display: grid;
	grid-template-columns: 280px minmax(0, 1fr);
	overflow: hidden;
	animation: diaryOpen 380ms cubic-bezier(0.2, 0.85, 0.25, 1) both;
	transform-origin: center center;
}

@keyframes diaryOpen {
	from {
		opacity: 0;
		transform: scale(0.94) translateY(10px) rotateY(3deg);
	}
	to {
		opacity: 1;
		transform: scale(1) translateY(0) rotateY(0);
	}
}


/* Barra da Esquerda */
.menu-sidebar {
	position: relative;
	padding: 24px 22px;
	border-right: 2px solid rgba(94, 60, 26, 0.55);
	display: grid;
	align-content: start;
	gap: 18px;
	background: rgba(253, 246, 225, 0.18);
}

.sidebar-header {
	text-align: center;
}

.sidebar-title {
	display: inline-flex;
	flex-direction: column;
	display: flex;
	flex-direction: column;
	line-height: 0.92;
	font-family: 'Caveat', cursive;
	font-weight: 700;
	color: #3a2818;
	transform: rotate(-2deg);
}

.sidebar-title span:first-child {
	font-size: 2.2rem;
	color: #6b4a2b;
}

.title-second {
	font-size: 2.5rem !important;
	color: #3a2818 !important;
	margin-left: 4px;
}

.sidebar-divider {
	text-align: center;
	color: #b1493a;
	font-size: 0.9rem;
	letter-spacing: 0.3em;
	opacity: 0.75;
	font-family: 'Crimson Pro', serif;
}

.language-panel {
	border: 1.5px dashed rgba(94, 60, 26, 0.55);
	border-radius: 6px;
	padding: 12px 12px 14px;
	background: rgba(255, 250, 230, 0.35);
}

.panel-label {
	display: flex;
	align-items: center;
	gap: 8px;
	font-family: 'Caveat', cursive;
	font-weight: 700;
	font-size: 1.35rem;
	color: #3a2818;
	margin-bottom: 10px;
}

.panel-pin {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: radial-gradient(circle at 30% 30%, #d35d4f, #8c2820 70%, #5a1612 100%);
	box-shadow:
		0 0 0 1.5px rgba(58, 16, 12, 0.6),
		inset 0 1px 1px rgba(255, 255, 255, 0.4);
}

.language-buttons {
	display: grid;
	gap: 6px;
}

.lang-btn {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 6px 10px;
	background: transparent;
	border: 1px solid rgba(94, 60, 26, 0.4);
	border-radius: 4px;
	font-family: 'Caveat', cursive;
	font-weight: 600;
	font-size: 1.2rem;
	color: #3a2818;
	cursor: pointer;
	transition: all 180ms ease;
	text-align: left;
}

.lang-btn:hover {
	background: rgba(255, 250, 230, 0.55);
	transform: translateX(3px);
}

.lang-btn:hover .lang-mark {
	transform: rotate(-4deg);
}

.lang-btn.is-active {
	background: rgba(122, 154, 78, 0.22);
	border-color: #5a7a3a;
	border-style: solid;
	color: #2e4a18;
}

.lang-btn.is-active .lang-mark {
	background: #5a7a3a;
	color: #f6efd9;
	border-color: #2e4a18;
	transform: rotate(-3deg);
}

.lang-mark {
	font-family: 'Crimson Pro', serif;
	font-weight: 700;
	font-size: 0.85rem;
	padding: 2px 6px;
	border: 1px solid #3a2818;
	border-radius: 3px;
	letter-spacing: 0.04em;
	background: rgba(255, 250, 230, 0.75);
	transition: transform 180ms ease;
	min-width: 26px;
	text-align: center;
}

.lang-name {
	font-family: 'Caveat', cursive;
	flex: 1;
}

.sidebar-actions {
	display: grid;
	gap: 12px;
	margin-top: 4px;
}

.stamp-btn {
	position: relative;
	font-family: 'Caveat', cursive;
	font-weight: 700;
	font-size: 1.4rem;
	padding: 10px 14px;
	background: rgba(255, 250, 230, 0.55);
	color: #3a2818;
	border: 2px solid #6b4a2b;
	border-radius: 4px;
	cursor: pointer;
	transition: transform 180ms ease, background 180ms ease;
	text-align: center;
	letter-spacing: 0.04em;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2px;
}

.stamp-btn::before {
	content: '';
	position: absolute;
	inset: 4px;
	border: 1px dashed rgba(94, 60, 26, 0.45);
	border-radius: 2px;
	pointer-events: none;
}

.stamp-btn:hover {
	background: rgba(255, 250, 230, 0.85);
	transform: rotate(-1.2deg) translateY(-1px);
}

.stamp-btn:hover::before { border-color: rgba(193, 74, 62, 0.6); }

.stamp-btn:active {
	transform: rotate(-0.5deg) translateY(0) scale(0.98);
}

.stamp-btn.is-primary {
	background:
		repeating-linear-gradient(45deg, rgba(255, 230, 200, 0.08) 0, rgba(255, 230, 200, 0.08) 6px, transparent 6px, transparent 12px),
		linear-gradient(180deg, #c14a3e 0%, #9a3a2e 60%, #7c2a22 100%);
	color: #f9edd1;
	border-color: #5a1810;
	text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.4);
	letter-spacing: 0.08em;
	box-shadow:
		0 3px 0 rgba(0, 0, 0, 0.3),
		inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.stamp-btn.is-primary::before { border-color: rgba(249, 237, 209, 0.45); }

.stamp-btn.is-primary:hover {
	transform: rotate(-1.5deg) translateY(-2px);
	filter: brightness(1.06);
}

.stamp-btn .stars {
	font-size: 0.65em;
	opacity: 0.95;
	margin-bottom: 1px;
	letter-spacing: 0.2em;
}

.stamp-btn .arrow {
	font-size: 0.85em;
	margin-bottom: 1px;
	color: #b1493a;
	font-family: 'Crimson Pro', serif;
}

.stamp-btn.is-primary .arrow { color: #f9edd1; }


/* Menu lado direito */
.menu-content {
	position: relative;
	display: grid;
	grid-template-rows: auto auto 1fr;
	padding: 22px 36px 20px;
	overflow: hidden;
}

.menu-content::before {
	content: '';
	position: absolute;
	left: 56px;
	top: 86px;
	bottom: 16px;
	width: 1.5px;
	background: rgba(193, 74, 62, 0.55);
	pointer-events: none;
	z-index: 0;
}

.page-header {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 16px;
	margin-bottom: 6px;
}

.menu-tabs {
	display: flex;
	gap: 4px;
	margin-right: -2px;
}

.menu-tab {
	position: relative;
	font-family: 'Caveat', cursive;
	font-weight: 700;
	font-size: 1.25rem;
	padding: 6px 16px 8px;
	background: rgba(232, 207, 158, 0.55);
	color: #6b4a2b;
	border: 1.5px solid rgba(94, 60, 26, 0.5);
	border-bottom: none;
	border-radius: 12px 12px 0 0;
	cursor: pointer;
	transition: all 200ms ease;
	display: flex;
	align-items: center;
	gap: 6px;
}

.menu-tab .tab-bullet {
	font-size: 0.85em;
	color: #b1493a;
	opacity: 0.8;
	transform: rotate(-8deg);
	transition: transform 220ms ease;
}

.menu-tab:hover {
	background: rgba(255, 247, 220, 0.85);
	color: #3a2818;
	transform: translateY(-1px);
}

.menu-tab:hover .tab-bullet { transform: rotate(15deg); }

.menu-tab.is-active {
	background: #fdf6e1;
	color: #3a2818;
	border-color: #6b4a2b;
	z-index: 2;
	transform: translateY(-2px);
}

.menu-tab.is-active::after {
	content: '';
	position: absolute;
	bottom: -2.5px;
	left: 0;
	right: 0;
	height: 4px;
	background: #fdf6e1;
}

.menu-tab.is-active .tab-bullet {
	color: #b1493a;
	transform: rotate(0deg);
	opacity: 1;
}

.menu-header {
	text-align: center;
	padding: 4px 8px 12px;
}

.handwritten {
	margin: 0;
	font-family: 'Caveat', cursive;
	font-weight: 700;
	font-size: clamp(2.2rem, 5.2vw, 3.6rem);
	color: #3a2818;
	line-height: 1;
	letter-spacing: 0.005em;
}

.menu-subtitle {
	margin: 2px 0 0;
	font-family: 'Caveat', cursive;
	font-weight: 600;
	font-size: 1.35rem;
	color: #6b4a2b;
}

.ink-line {
	margin: 8px auto 0;
	height: 2.5px;
	width: 70%;
	background: linear-gradient(to right, transparent, #3a2818 20%, #3a2818 80%, transparent);
	border-radius: 2px;
}

.content-scroll {
	overflow: auto;
	padding: 8px 8px 12px 16px;
}

.washi-tape {
	position: absolute;
	top: -10px;
	width: 130px;
	height: 26px;
	border-radius: 2px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.18);
	z-index: 3;
	pointer-events: none;
}

.washi-tape--left {
	left: 80px;
	background:
		repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.18) 0, rgba(255, 255, 255, 0.18) 4px, transparent 4px, transparent 8px),
		linear-gradient(180deg, #d9a64a 0%, #b8893a 100%);
	transform: rotate(-4deg);
}

.washi-tape--right {
	right: 110px;
	background:
		repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.18) 0, rgba(255, 255, 255, 0.18) 4px, transparent 4px, transparent 8px),
		linear-gradient(180deg, #6a8e44 0%, #4a6c2a 100%);
	transform: rotate(5deg);
}

@media (max-width: 980px) {
	.menu-frame {
		grid-template-columns: 1fr;
		height: min(94vh, 880px);
		border-radius: 6px 6px 26px 26px;
	}
	.menu-sidebar {
		border-right: 0;
		border-bottom: 2px solid rgba(94, 60, 26, 0.55);
	}
	.menu-content { padding: 18px 22px 14px; }
	.menu-content::before { display: none; }
	.washi-tape--left { left: 16px; }
	.washi-tape--right { right: 22px; }
}
</style>
