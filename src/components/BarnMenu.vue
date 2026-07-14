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
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.barn-overlay,
.barn-overlay * { box-sizing: border-box; }

.barn-overlay {
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

.barn-overlay.is-open { opacity: 1; visibility: visible; }

.barn-frame {
    position: relative;
    width: min(720px, 100%);
    max-height: min(86vh, 640px);
    overflow: auto;
    border-radius: 8px;
    border: 1.5px dashed rgba(94, 60, 26, 0.55);
    background: radial-gradient(ellipse at 22% 16%, #fdf6e1 0%, #f0e1b6 38%, #dcbf85 100%);
    box-shadow:
        0 30px 80px rgba(0, 0, 0, 0.4),
        inset 0 0 60px rgba(94, 60, 26, 0.12);
    padding: 28px 28px 24px;
    text-align: center;
}

.barn-close-x {
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
.barn-close-x::before {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px dashed rgba(94, 60, 26, 0.4);
    border-radius: 3px;
    pointer-events: none;
}
.barn-close-x:hover {
    background: rgba(255, 250, 230, 0.95);
    transform: rotate(-2deg);
}
.barn-close-x:focus-visible {
    outline: 2px solid #5a7a3a;
    outline-offset: 2px;
}

.barn-header { margin-top: 6px; margin-bottom: 18px; }
.barn-header h1 {
    margin: 0;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: clamp(1.7rem, 4vw, 2.6rem);
    color: #3a2818;
    line-height: 1.05;
}
.barn-header p {
    margin: 6px 0 0;
    font-family: 'Caveat', cursive;
    font-weight: 500;
    font-size: 1.15rem;
    color: #6b4a2b;
    font-style: italic;
}

.barn-section { margin-top: 14px; }

.section-title {
    margin: 0 0 10px;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 1.35rem;
    color: #5a7a3a;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 6px;
}
.section-title::before {
    content: '❀';
    color: #b1493a;
    font-size: 0.85em;
    transform: rotate(-12deg);
    display: inline-block;
}

.inventory-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-top: 8px;
}
@media (max-width: 640px) { .inventory-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 420px) { .inventory-grid { grid-template-columns: repeat(2, 1fr); } }

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
    transform: translateX(-50%) rotate(-3deg);
    width: 40px;
    height: 14px;
    background:
        repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.20) 0, rgba(255, 255, 255, 0.20) 2px, transparent 2px, transparent 5px),
        linear-gradient(180deg, #d9a64a 0%, #b8893a 100%);
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
.item-qty {
    font-size: 1.05rem;
    color: #5a7a3a;
    margin-top: 2px;
    font-family: 'Caveat', cursive;
    font-weight: 700;
}
</style>
