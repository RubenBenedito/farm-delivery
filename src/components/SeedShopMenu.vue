<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { PRODUCTS } from '../items/products.js';

const props = defineProps({
    open: Boolean,
    text: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close']);

const t = computed(() => props.text?.seedMenu ?? {});

// Preços das sementes
const prices = {
    orange: 5,
    pomegranate: 6,
    pear: 4,
    apple: 5,
    banana: 3
};


// Inventário de sementes compradas
const seedInventory = reactive({});

// Sincronizar o inventário de sementes 
function syncSeeds() {
    const scene = window.game?.scene?.keys?.GameScene;
    for (const id in PRODUCTS) {
        seedInventory[id] = scene?.purchasedSeeds?.[id] ?? 0;
    }
}

onMounted(() => {
    syncSeeds();
});

const money = ref(window.game?.scene?.keys?.GameScene?.money ?? 0);

function refreshMoney() {
    const scene = window.game?.scene?.keys?.GameScene;
    if (scene) money.value = scene.money;
}

function buy(id) {
    const scene = window.game?.scene?.keys?.GameScene;
    if (!scene) return;

    const price = prices[id];
    if (scene.money >= price) {
        scene.money -= price;

        scene.purchasedSeeds = scene.purchasedSeeds ?? {};
        scene.purchasedSeeds[id] = (scene.purchasedSeeds[id] ?? 0) + 1;
        seedInventory[id] = scene.purchasedSeeds[id];

        scene.seeds = scene.seeds ?? {};
        scene.seeds[id] = (scene.seeds[id] ?? 0) + 1;

        refreshMoney();
    }
}

function close() {
    emit('close');
}
</script>

<template>
    <div class="seedshop-overlay" :class="{ 'is-open': open }">
        <div class="seedshop-frame">
            <button class="seedshop-close-x" @click="close" :aria-label="t.close">×</button>

            <header class="seedshop-header">
                <h1>{{ t.title }}</h1>
                <p>{{ t.description }}</p>
            </header>

            <div class="seedshop-grid">
                <div v-for="p in PRODUCTS" :key="p.id" class="slot">
                    <img :src="p.image" class="item-icon" />
                    <div class="item-name">{{ text.barnMenu?.products?.[p.id] ?? p.id }}</div>
                    <div class="item-price">
                        <span class="coin">●</span> {{ prices[p.id] }}
                    </div>
                    <div class="item-owned">{{ seedInventory[p.id] || 0 }} {{ t.owned || 'Owned' }}</div>
                    <button class="item-buy" @click="buy(p.id)">{{ t.buy || 'Comprar' }}</button>
                </div>
            </div>

            <footer class="seedshop-footer">
                <span class="wallet">💰 {{ money }}</span>
            </footer>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Press+Start+2P&display=swap');

.seedshop-overlay,
.seedshop-overlay * {
    box-sizing: border-box;
}

/* Fundo Escuro */
.seedshop-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: grid;
    place-items: center;
    padding: 16px;

    opacity: 0;
    visibility: hidden;
    transition: opacity 160ms ease, visibility 160ms ease;

    background:
        radial-gradient(circle at 16% 16%, rgba(66, 131, 81, 0.3), transparent 34%),
        radial-gradient(circle at 86% 82%, rgba(214, 154, 55, 0.18), transparent 36%),
        rgba(4, 8, 7, 0.92);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    font-family: 'Outfit', sans-serif;
}

.seedshop-overlay.is-open {
    opacity: 1;
    visibility: visible;
}

/* Menu */
.seedshop-frame {
    position: relative;
    width: min(720px, 100%);

    border-radius: 24px;
    border: 1px solid rgba(201, 150, 84, 0.35);
    background: linear-gradient(180deg, rgba(4, 8, 26, 0.98), rgba(2, 6, 18, 0.98));
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);

    padding: 28px 28px 24px;
    text-align: center;
}

.seedshop-close-x {
    position: absolute;
    top: 12px;
    right: 14px;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    border: 1px solid rgba(191, 144, 79, 0.45);
    background: linear-gradient(180deg, rgba(21, 26, 40, 0.88), rgba(14, 18, 30, 0.92));
    color: #eddcb7;
    font-size: 26px;
    font-weight: 700;
    line-height: 1;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: transform 120ms ease, filter 120ms ease, border-color 120ms ease;
}

.seedshop-close-x:hover {
    transform: translateY(-1px);
    filter: brightness(1.15);
    border-color: rgba(157, 216, 126, 0.56);
    color: #d8f4b0;
}

.seedshop-close-x:focus-visible {
    outline: 2px solid rgba(157, 216, 126, 0.7);
    outline-offset: 2px;
}

.seedshop-header {
    margin-top: 6px;
    margin-bottom: 18px;
}

.seedshop-header h1 {
    margin: 0;
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(1.1rem, 2.6vw, 1.7rem);
    color: #eddcb7;
}

.seedshop-header p {
    margin: 10px 0 0;
    color: rgba(228, 215, 191, 0.76);
    font-size: 1rem;
}

.seedshop-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-top: 8px;
}

@media (max-width: 640px) {
    .seedshop-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 420px) {
    .seedshop-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

.slot {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(201, 150, 84, 0.28);
    border-radius: 12px;
    padding: 10px;
    text-align: center;
    transition: border-color 120ms ease, transform 120ms ease;
}

.slot:hover {
    border-color: rgba(157, 216, 126, 0.45);
    transform: translateY(-1px);
}

.item-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 6px;
    image-rendering: pixelated;
}

.item-name {
    font-size: 13px;
    font-weight: 700;
    color: #eddcb7;
}

.item-price {
    font-size: 11px;
    color: rgba(255, 213, 119, 0.92);
    margin: 6px 0 4px;
    font-weight: 600;
}

.coin {
    color: #ffd47a;
    margin-right: 2px;
}

.item-owned {
    font-size: 10px;
    color: rgba(228, 215, 191, 0.7);
    margin-bottom: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.item-buy {
    cursor: pointer;
    border: 1px solid rgba(191, 144, 79, 0.5);
    background: linear-gradient(180deg, rgba(48, 44, 26, 0.95), rgba(28, 24, 14, 0.95));
    color: #eddcb7;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    transition: filter 120ms ease, transform 120ms ease, border-color 120ms ease;
}

.item-buy:hover {
    filter: brightness(1.2);
    border-color: rgba(214, 154, 55, 0.7);
    transform: translateY(-1px);
}

.item-buy:active {
    transform: translateY(0);
}

.seedshop-footer {
    margin-top: 18px;
    padding: 12px 6px 0;
    border-top: 1px solid rgba(201, 150, 84, 0.28);
    text-align: right;
}

.wallet {
    font-size: 14px;
    font-weight: 700;
    color: #ffd47a;
}
</style>
