<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { PRODUCTS } from '../items/products.js';

const props = defineProps({
    open: Boolean,
    text: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close']);

const t = computed(() => props.text?.seedMenu ?? {});

const unlockedIds = ref([]);

// Sincroniza os items desbloqueados
function syncUnlocked() {
    const s = window.game?.scene?.keys?.GameScene;
    unlockedIds.value = s?.unlockedItems ?? [];
}

const visibleProducts = computed(() =>
    Object.values(PRODUCTS).filter(
        (p) => !p.locked || unlockedIds.value.includes(p.id)
    )
);

function buyPriceOf(id) {
    return PRODUCTS[id]?.buyPrice ?? 2;
}

// Inventário de sementes compradas
const seedInventory = reactive({});

function syncSeeds() {
    const scene = window.game?.scene?.keys?.GameScene;
    for (const id in PRODUCTS) {
        seedInventory[id] = scene?.purchasedSeeds?.[id] ?? 0;
    }
}

// Sincroniza todos os dados da loja
function syncAll() {
    syncSeeds();
    syncUnlocked();
    refreshMoney();
}

onMounted(syncAll);

// Sincroniza a loja
watch(() => props.open, (isOpen) => {
    if (isOpen) syncAll();
});

const money = ref(window.game?.scene?.keys?.GameScene?.money ?? 0);

function refreshMoney() {
    const scene = window.game?.scene?.keys?.GameScene;
    if (scene) money.value = scene.money;
}

// Comprar sementes
function buy(id) {
    const scene = window.game?.scene?.keys?.GameScene;
    if (!scene) return;

    const price = buyPriceOf(id);
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
                <div v-for="p in visibleProducts" :key="p.id" class="slot">
                    <img v-if="p.image" :src="p.image" class="item-icon" :alt="p.id" />
                    <span v-else class="item-icon-fallback">📦</span>
                    <div class="item-name">{{ text.barnMenu?.seedsProducts?.[p.id] ?? text.barnMenu?.products?.[p.id] ?? p.id }}</div>
                    <div class="item-price">
                        <span class="coin">●</span> {{ buyPriceOf(p.id) }}
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
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.seedshop-overlay,
.seedshop-overlay * { box-sizing: border-box; }

.seedshop-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: grid;
    place-items: center;
    padding: 16px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 220ms ease, visibility 220ms ease;
    background:
        radial-gradient(ellipse at 50% 45%, rgba(232, 200, 130, 0.20), transparent 60%),
        radial-gradient(circle at 10% 92%, rgba(58, 32, 12, 0.55), transparent 32%),
        radial-gradient(circle at 92% 8%, rgba(58, 32, 12, 0.50), transparent 32%),
        rgba(20, 12, 6, 0.55);
    backdrop-filter: blur(6px) sepia(0.30);
    -webkit-backdrop-filter: blur(6px) sepia(0.30);
    font-family: 'Crimson Pro', 'Georgia', serif;
}

.seedshop-overlay.is-open { opacity: 1; visibility: visible; }

.seedshop-frame {
    position: relative;
    width: min(720px, 100%);
    border-radius: 8px;
    border: 1.5px dashed rgba(94, 60, 26, 0.55);
    background: radial-gradient(ellipse at 22% 16%, #fdf6e1 0%, #f0e1b6 38%, #dcbf85 100%);
    box-shadow:
        0 30px 80px rgba(0, 0, 0, 0.4),
        inset 0 0 60px rgba(94, 60, 26, 0.12);
    padding: 28px 28px 22px;
    text-align: center;
}

.seedshop-close-x {
    position: absolute;
    top: 12px;
    right: 14px;
    width: 38px;
    height: 38px;
    border-radius: 6px;
    border: 2px solid #6b4a2b;
    background: rgba(255, 250, 230, 0.7);
    color: #3a2818;
    font-family: 'Crimson Pro', serif;
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: transform 180ms ease, background 180ms ease;
}

.seedshop-close-x::before {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px dashed rgba(94, 60, 26, 0.4);
    border-radius: 3px;
    pointer-events: none;
}

.seedshop-close-x:hover {
    background: rgba(255, 250, 230, 0.95);
    transform: rotate(-2deg);
}

.seedshop-close-x:focus-visible {
    outline: 2px solid #5a7a3a;
    outline-offset: 2px;
}

.seedshop-header { margin-top: 6px; margin-bottom: 18px; }
.seedshop-header h1 {
    margin: 0;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: clamp(1.7rem, 4vw, 2.6rem);
    color: #3a2818;
    line-height: 1.05;
}

.seedshop-header p {
    margin: 6px 0 0;
    font-family: 'Caveat', cursive;
    font-weight: 500;
    font-size: 1.15rem;
    color: #6b4a2b;
    font-style: italic;
}

.seedshop-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-top: 8px;
}
@media (max-width: 640px) { .seedshop-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 420px) { .seedshop-grid { grid-template-columns: repeat(2, 1fr); } }

.slot {
    position: relative;
    background: rgba(255, 251, 235, 0.85);
    border: 1.5px dashed rgba(94, 60, 26, 0.5);
    border-radius: 6px;
    padding: 14px 8px 10px;
    text-align: center;
    transition: transform 180ms ease, border-color 180ms ease;
}

.slot::before {
    content: '';
    position: absolute;
    top: -7px;
    left: 50%;
    transform: translateX(-50%) rotate(3deg);
    width: 40px;
    height: 14px;
    background:
        repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.20) 0, rgba(255, 255, 255, 0.20) 2px, transparent 2px, transparent 5px),
        linear-gradient(180deg, #6a8e44 0%, #4a6c2a 100%);
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.slot:hover {
    border-color: #5a7a3a;
    transform: translateY(-1px) rotate(-0.5deg);
}

.item-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 6px;
    image-rendering: pixelated;
}
.item-icon-fallback {
    display: inline-grid;
    place-items: center;
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
    margin-bottom: 6px;
    background: rgba(94, 60, 26, 0.14);
    border-radius: 6px;
}

.item-name {
    font-size: 13px;
    font-weight: 600;
    color: #3a2818;
    font-family: 'Crimson Pro', serif;
}

.item-price {
    font-size: 1.1rem;
    color: #b1493a;
    margin: 4px 0 2px;
    font-family: 'Caveat', cursive;
    font-weight: 700;
}

.coin {
    color: #d9a64a;
    margin-right: 2px;
    font-size: 0.9em;
}

.item-owned {
    font-size: 11px;
    color: #5a7a3a;
    margin-bottom: 8px;
    font-weight: 600;
    font-family: 'Crimson Pro', serif;
    font-style: italic;
}

.item-buy {
    cursor: pointer;
    border: 2px solid #5a1810;
    background:
        repeating-linear-gradient(45deg, rgba(255, 230, 200, 0.08) 0, rgba(255, 230, 200, 0.08) 4px, transparent 4px, transparent 8px),
        linear-gradient(180deg, #c14a3e 0%, #9a3a2e 60%, #7c2a22 100%);
    color: #f9edd1;
    padding: 6px 14px;
    border-radius: 4px;
    font-size: 1.05rem;
    font-weight: 700;
    font-family: 'Caveat', cursive;
    letter-spacing: 0.04em;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
    box-shadow:
        0 2px 0 rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.18);
    transition: transform 180ms ease, filter 180ms ease;
}

.item-buy:hover {
    transform: rotate(-1.5deg) translateY(-1px);
    filter: brightness(1.06);
}

.item-buy:active { transform: translateY(0); }

.seedshop-footer {
    margin-top: 18px;
    padding: 12px 6px 0;
    border-top: 1.5px dashed rgba(94, 60, 26, 0.4);
    text-align: right;
}

.wallet {
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 1.3rem;
    color: #5a7a3a;
}
</style>
