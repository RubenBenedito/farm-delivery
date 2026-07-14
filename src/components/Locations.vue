<script setup>
import { computed } from 'vue';

const props = defineProps({
	text: Object
});

const base = '/assets/';

const locations = computed(() => [
	{
		img: base + 'House.png',
		label: props.text.mainMenu.locations.farm,
		desc: props.text.mainMenu.locations.farmDesc,
		tilt: -1.2
	},
	{
		img: base + 'Big_Shed.png',
		label: props.text.mainMenu.locations.shop,
		desc: props.text.mainMenu.locations.shopDesc,
		tilt: 0.9
	},
	{
		img: base + 'Stone_Cabin.png',
		label: props.text.mainMenu.locations.sell,
		desc: props.text.mainMenu.locations.sellDesc,
		tilt: -0.8
	},
	{
		img: base + 'Coop.png',
		label: props.text.mainMenu.locations.juicer,
		desc: props.text.mainMenu.locations.juicerDesc,
		tilt: 1.4
	},
	{
		img: base + 'Barn.png',
		label: props.text.mainMenu.locations.barn,
		desc: props.text.mainMenu.locations.barnDesc,
		tilt: -1.1
	}
]);

const tapeColors = ['#d9a64a', '#6a8e44', '#c14a3e', '#8b6ba8', '#5a8a9e'];
</script>



<template>
	<div class="locations-grid">
		<article
			class="location-card"
			v-for="(loc, idx) in locations"
			:key="loc.label"
			:style="{ '--tilt': loc.tilt + 'deg', '--tape-color': tapeColors[idx % tapeColors.length] }"
		>
			<span class="washi" aria-hidden="true"></span>

			<div class="photo-frame">
				<img :src="loc.img" :alt="loc.label" />
			</div>

			<h4 class="caption-label">{{ loc.label }}</h4>
			<p class="caption-desc">{{ loc.desc }}</p>
		</article>
	</div>
</template>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600&display=swap');

.locations-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 36px 26px;
	padding: 12px 4px;
}

.location-card {
	position: relative;
	background: #fdf9ef;
	border: 1px solid rgba(58, 40, 24, 0.18);
	padding: 14px 14px 18px;
	color: #3a2818;
	box-shadow:
		0 6px 18px rgba(94, 60, 26, 0.22),
		inset 0 0 0 6px rgba(253, 249, 239, 1),
		inset 0 0 0 7px rgba(58, 40, 24, 0.10);
	transform: rotate(var(--tilt, 0deg));
	transition: transform 240ms ease, box-shadow 240ms ease;
	cursor: default;
}

.location-card:hover {
	transform: rotate(0deg) translateY(-3px) scale(1.02);
	box-shadow:
		0 14px 28px rgba(94, 60, 26, 0.28),
		inset 0 0 0 6px rgba(253, 249, 239, 1),
		inset 0 0 0 7px rgba(58, 40, 24, 0.10);
}

.washi {
	position: absolute;
	top: -10px;
	left: 50%;
	transform: translateX(-50%) rotate(calc(var(--tilt, 0deg) * -1));
	width: 92px;
	height: 22px;
	background:
		repeating-linear-gradient(
			-45deg,
			rgba(255, 255, 255, 0.20) 0,
			rgba(255, 255, 255, 0.20) 3px,
			transparent 3px,
			transparent 7px
		),
		linear-gradient(180deg, var(--tape-color, #d9a64a) 0%, rgba(0, 0, 0, 0.18) 100%),
		var(--tape-color, #d9a64a);
	border-radius: 2px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.22);
	z-index: 2;
}

.photo-frame {
	width: 100%;
	aspect-ratio: 4 / 3;
	background:
		linear-gradient(135deg, rgba(94, 60, 26, 0.06), rgba(94, 60, 26, 0.18)),
		repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.04) 0, rgba(0, 0, 0, 0.04) 2px, transparent 2px, transparent 5px);
	border-radius: 2px;
	overflow: hidden;
	margin-bottom: 10px;
	display: grid;
	place-items: center;
}

.photo-frame img {
	max-width: 78%;
	max-height: 78%;
	object-fit: contain;
	filter: sepia(0.35) saturate(0.85) contrast(1.05);
	transition: filter 240ms ease, transform 240ms ease;
}

.location-card:hover .photo-frame img {
	filter: sepia(0.15) saturate(1) contrast(1.05);
	transform: scale(1.04);
}

.caption-label {
	margin: 4px 0 0;
	font-family: 'Caveat', cursive;
	font-weight: 700;
	font-size: 1.65rem;
	color: #3a2818;
	text-align: center;
}

.caption-desc {
	margin: 4px 0 0;
	font-family: 'Crimson Pro', serif;
	font-style: italic;
	font-size: 0.98rem;
	line-height: 1.35;
	text-align: center;
	color: #6b4a2b;
}

@media (max-width: 900px) {
	.locations-grid { grid-template-columns: 1fr; gap: 30px; }
	.location-card { transform: none; }
	.location-card:hover {
		transform: translateY(-3px) scale(1.01);
	}
}
</style>
