<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { PRODUCTS } from '../items/products.js';

const props = defineProps({
    open: Boolean,
    text: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close']);

const t = computed(() => props.text?.barnMenu ?? {});

// Sementes disponíveis e produtos
const inventorySeeds = reactive({});
const inventoryHarvest = reactive({});

function syncInventory() {
    const scene = window.game?.scene?.keys?.GameScene;
    for (const id in PRODUCTS) {
        inventorySeeds[id] = scene?.seeds?.[id] ?? PRODUCTS[id].defaultQuantity;
        inventoryHarvest[id] = scene?.harvest?.[id] ?? 0;
    }
    syncUnlocked(); // Refresh
}

const unlockedIds = ref([]);

// Sincroniza os itens desbloqueados
function syncUnlocked() {
    const scene = window.game?.scene?.keys?.GameScene;
    unlockedIds.value = scene?.unlockedItems ?? [];
}

const visibleProducts = computed(() =>
    Object.values(PRODUCTS).filter(
        (p) => !p.locked || unlockedIds.value.includes(p.id)
    )
);

onMounted(() => {
    syncInventory();
});


watch(() => props.open, (isOpen) => {
    if (isOpen) syncInventory();
});

function close() {
    emit('close');
}
</script>

<template>
    <div class="barn-overlay" :class="{ 'is-open': open }">
        <div class="barn-frame">
            <button class="barn-close-x" @click="close" :aria-label="t.close">×</button>

            <header class="barn-header">
                <h1>{{ t.title }}</h1>
                <p>{{ t.description }}</p>
            </header>

            <section class="barn-section">
                <h2 class="section-title">{{ t.sections?.seeds }}</h2>
                <div class="inventory-grid">
                    <div v-for="p in visibleProducts" :key="p.id" class="slot">
                        <img v-if="p.image" :src="p.image" class="item-icon" :alt="p.id" />
                        <span v-else class="item-icon-fallback">📦</span>
                        <div class="item-name">{{ t.seedsProducts?.[p.id] ?? p.id }}</div>
                        <div class="item-qty">{{ inventorySeeds[p.id] }}</div>
                    </div>
                </div>
            </section>

            <section class="barn-section">
                <h2 class="section-title">{{ t.sections?.harvest }}</h2>
                <div class="inventory-grid">
                    <div v-for="p in visibleProducts" :key="p.id" class="slot">
                        <img v-if="p.image" :src="p.image" class="item-icon" :alt="p.id" />
                        <span v-else class="item-icon-fallback">📦</span>
                        <div class="item-name">{{ t.harvestProducts?.[p.id] ?? p.id }}</div>
                        <div class="item-qty">{{ inventoryHarvest[p.id] }}</div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Press+Start+2P&display=swap');

.barn-overlay,
.barn-overlay * {
    box-sizing: border-box;
}

/* Fundo Escuro */
.barn-overlay {
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

.barn-overlay.is-open {
    opacity: 1;
    visibility: visible;
}

/* Menu */
.barn-frame {
    position: relative;
    width: min(720px, 100%);
    max-height: min(86vh, 640px);
    overflow: auto;

    border-radius: 24px;
    border: 1px solid rgba(201, 150, 84, 0.35);
    background: linear-gradient(180deg, rgba(4, 8, 26, 0.98), rgba(2, 6, 18, 0.98));
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);

    padding: 28px 28px 24px;
    text-align: center;
}

.barn-close-x {
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

.barn-close-x:hover {
    transform: translateY(-1px);
    filter: brightness(1.15);
    border-color: rgba(157, 216, 126, 0.56);
    color: #d8f4b0;
}

.barn-close-x:focus-visible {
    outline: 2px solid rgba(157, 216, 126, 0.7);
    outline-offset: 2px;
}

.barn-header {
    margin-top: 6px;
    margin-bottom: 18px;
}

.barn-header h1 {
    margin: 0;
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(1.1rem, 2.6vw, 1.7rem);
    color: #eddcb7;
}

.barn-header p {
    margin: 10px 0 0;
    color: rgba(228, 215, 191, 0.76);
    font-size: 1rem;
}

.barn-section {
    margin-top: 14px;
}

.section-title {
    margin: 0 0 10px;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.5px;
    color: rgba(157, 216, 126, 0.92);
    text-align: left;
}

.inventory-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-top: 8px;
}

@media (max-width: 640px) {
    .inventory-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 420px) {
    .inventory-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

.slot {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(201, 150, 84, 0.28);
    border-radius: 12px;
    padding: 10px;
    text-align: center;
}

.slot:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(157, 216, 126, 0.45);
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
    background: rgba(0, 0, 0, .25);
    border-radius: 10px;
}

.item-name {
    font-size: 13px;
    font-weight: 700;
    color: #eddcb7;
}

.item-qty {
    font-size: 12px;
    color: rgba(157, 216, 126, 0.85);
    margin-top: 2px;
}
</style>
