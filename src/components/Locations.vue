
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
		desc: props.text.mainMenu.locations.farmDesc
	},
	{
		img: base + 'Big_Shed.png',
		label: props.text.mainMenu.locations.shop,
		desc: props.text.mainMenu.locations.shopDesc
	},
	{
		img: base + 'Stone_Cabin.png',
		label: props.text.mainMenu.locations.sell,
		desc: props.text.mainMenu.locations.sellDesc
	},
	{
		img: base + 'Coop.png',
		label: props.text.mainMenu.locations.juicer,
		desc: props.text.mainMenu.locations.juicerDesc
	},
	{
		img: base + 'Barn.png',
		label: props.text.mainMenu.locations.barn,
		desc: props.text.mainMenu.locations.barnDesc
	}
]);
</script>



<template>
	<div class="locations-grid">
		<article class="location-card" v-for="loc in locations" :key="loc.label">
			<img :src="loc.img" :alt="loc.label" />
			<h4>{{ loc.label }}</h4>
			<p>{{ loc.desc }}</p>
		</article>
	</div>
</template>


<style scoped>
.locations-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 14px;
}

.location-card {
	background: #e2cfa8;
	border-radius: 14px;
	border: 1px solid #b89463;
	padding: 10px;
	color: #4e3924;
}

.location-card img {
	width: 100%;
	aspect-ratio: 4 / 3;
	object-fit: contain;
	background: rgba(46, 27, 14, 0.12);
	border-radius: 8px;
	margin-bottom: 8px;
}

.location-card h4 {
	margin: 0;
	font-size: 0.95rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.location-card p {
	margin: 6px 0 0;
	font-size: 0.95rem;
	line-height: 1.3;
}

@media (max-width: 900px) {
	.locations-grid {
		grid-template-columns: 1fr;
	}
}
</style>
