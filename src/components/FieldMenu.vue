<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { PRODUCTS } from '../items/products.js';

const props = defineProps({
    open: Boolean,
    fieldId: { type: Number, default: null },
    text: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close']);

const t = computed(() => props.text?.fieldMenu ?? {});
const sectionT = computed(() => props.text?.barnMenu?.sections ?? {});

const inventorySeeds = reactive({});
const unlockedIds = ref([]);

const fieldState = ref({ state: 'empty', seedType: null, timeLeft: 0 });

function syncAll() {
    const scene = window.game?.scene?.keys?.GameScene;
    if (!scene) return;

    // Sementes
    for (const id in PRODUCTS) {
        inventorySeeds[id] = scene.seeds?.[id] ?? PRODUCTS[id].defaultQuantity;
    }

    // Itens desbloqueados
    unlockedIds.value = scene.unlockedItems ?? [];

    // Estado do campo
    const f = scene.fields?.find(x => x.id === props.fieldId);
    if (f) fieldState.value = { state: f.state, seedType: f.seedType, timeLeft: f.timeLeft };
}

const visibleSeeds = computed(() =>
    Object.values(PRODUCTS).filter(
        (p) => !p.locked || unlockedIds.value.includes(p.id)
    )
);

const currentField = computed(() => {
    const scene = window.game?.scene?.keys?.GameScene;
    return scene?.fields?.find(x => x.id === props.fieldId);
});

const fieldCost = computed(() => {
    const scene = window.game?.scene?.keys?.GameScene;
    if (!scene) return 0;
    const f = scene.fields?.find(x => x.id === props.fieldId);
    if (!f) return 0;
    return f.config?.seedCost ?? 3;
});

// Plantar
function plant(seedType) {
    const scene = window.game?.scene?.keys?.GameScene;
    const f = currentField.value;
    if (!scene || !f) return;

    if (f.state !== 'empty') return;

    const ok = f.plant(seedType);
    if (ok) {
        syncAll();
    }
}

// Colher
function harvest() {
    const scene = window.game?.scene?.keys?.GameScene;
    const f = currentField.value;
    if (!scene || !f) return;

    if (f.state !== 'ready') return;

    const got = f.harvest();
    if (got > 0) {
        flashHarvest(got);
        syncAll();
    }
}

const lastHarvest = ref(null);

function flashHarvest(amount) {
    lastHarvest.value = amount;
    setTimeout(() => { lastHarvest.value = null; }, 1200);
}

onMounted(syncAll);

watch(() => props.open, (isOpen) => {
    if (isOpen) syncAll();
});

function productImage(item) {
    return PRODUCTS[item]?.image ?? null;
}

function productName(item) {
    return props.text?.barnMenu?.seedsProducts?.[item]
        ?? props.text?.barnMenu?.harvestProducts?.[item]
        ?? item;
}

function growTotal(id) {
    return PRODUCTS[id]?.growTime ?? 30000;
}

function progressPct() {
    const f = currentField.value;
    if (!f || f.state !== 'growing') return 0;
    return Math.max(0, Math.min(100, (1 - f.timeLeft / growTotal(f.seedType)) * 100));
}

function stateLabel() {
    const s = fieldState.value.state;
    if (s === 'empty') return t.value?.states?.empty || 'Vazio';
    if (s === 'growing') return t.value?.states?.growing || 'A crescer';
    if (s === 'ready') return t.value?.states?.ready || 'Pronto a colher';
    return s;
}

function close() {
    emit('close');
}
</script>

<template>
    <div class="field-overlay" :class="{ 'is-open': open }" @click.self="close">
        <div class="field-frame">
            <button class="field-close-x" @click="close" :aria-label="t.close">×</button>

            <header class="field-header">
                <div class="field-icon" aria-hidden="true">🌱</div>
                <h1>{{ t.title }}</h1>
                <p>{{ t.description }}</p>
            </header>

            <section class="field-status">
                <div class="status-row">
                    <span class="status-label">{{ t.status }}</span>
                    <span :class="['status-pill', `is-${fieldState.state}`]">{{ stateLabel() }}</span>
                </div>

                <div v-if="fieldState.seedType" class="status-row">
                    <div class="seed-pill">
                        <img v-if="productImage(fieldState.seedType)" :src="productImage(fieldState.seedType)" :alt="productName(fieldState.seedType)" />
                        <span v-else class="seed-fallback">📦</span>
                        <span>{{ productName(fieldState.seedType) }}</span>
                    </div>
                </div>

                <div v-if="fieldState.state === 'growing'" class="growth-bar">
                    <div class="growth-fill" :style="{ width: progressPct() + '%' }"></div>
                </div>

                <button
                    v-if="fieldState.state === 'ready'"
                    class="harvest-btn is-shine"
                    @click="harvest"
                >
                    <span class="harvest-label">{{ t.harvest }}</span>
                    <span class="harvest-coin">+🪙</span>
                </button>
            </section>

            <section v-if="fieldState.state === 'empty'" class="field-section">
                <h2 class="section-title">{{ t.plant }}</h2>
                <div class="seed-grid">
                    <button
                        v-for="p in visibleSeeds"
                        :key="p.id"
                        class="seed-card"
                        :disabled="(inventorySeeds[p.id] ?? 0) < fieldCost"
                        @click="plant(p.id)"
                    >
                        <img v-if="p.image" :src="p.image" :alt="productName(p.id)" class="seed-img" />
                        <span v-else class="seed-fallback">📦</span>
                        <div class="seed-name">{{ productName(p.id) }}</div>
                        <div class="seed-cost">
                            <span class="cost-x">{{ fieldCost }}×</span>
                            <span class="cost-have">({{ inventorySeeds[p.id] ?? 0 }})</span>
                        </div>
                    </button>
                </div>
                <p v-if="visibleSeeds.length === 0" class="empty-msg">{{ t.lockedAll }}</p>
            </section>

            <p v-if="lastHarvest" class="harvest-flash">+{{ lastHarvest }} {{ t.units }}</p>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Press+Start+2P&display=swap');

.field-overlay,
.field-overlay * {
    box-sizing: border-box;
}

.field-overlay {
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
        radial-gradient(circle at 18% 14%, rgba(95, 175, 80, 0.3), transparent 36%),
        radial-gradient(circle at 84% 86%, rgba(214, 154, 55, 0.18), transparent 38%),
        rgba(4, 8, 7, 0.92);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    font-family: 'Outfit', sans-serif;
}

.field-overlay.is-open {
    opacity: 1;
    visibility: visible;
}

.field-frame {
    position: relative;
    width: min(720px, 100%);
    max-height: min(86vh, 640px);
    overflow: auto;

    border-radius: 24px;
    border: 1px solid rgba(157, 216, 126, 0.35);
    background: linear-gradient(180deg, rgba(4, 18, 10, 0.98), rgba(2, 8, 6, 0.98));
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);

    padding: 28px 28px 22px;
    text-align: center;
}

.field-close-x {
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

.field-close-x:hover {
    transform: translateY(-1px);
    filter: brightness(1.15);
    border-color: rgba(157, 216, 126, 0.56);
    color: #d8f4b0;
}

.field-header {
    margin-top: 6px;
    margin-bottom: 16px;
}

.field-icon {
    font-size: 1.7rem;
    margin-bottom: 6px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

.field-header h1 {
    margin: 0;
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(1.1rem, 2.6vw, 1.7rem);
    color: #eddcb7;
    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.45);
}

.field-header p {
    margin: 10px 0 0;
    color: rgba(228, 215, 191, 0.76);
    font-size: 1rem;
}

.field-status {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(157, 216, 126, 0.22);
    border-radius: 14px;
    padding: 12px 14px;
    margin-bottom: 14px;
    display: grid;
    gap: 10px;
    text-align: left;
}

.status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.status-label {
    color: rgba(228, 215, 191, 0.74);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-pill {
    font-family: 'Press Start 2P', monospace;
    font-size: 0.7rem;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(157, 216, 126, 0.15);
    color: #d8f4b0;
    border: 1px solid rgba(157, 216, 126, 0.5);
}
.status-pill.is-growing {
    background: rgba(214, 154, 55, 0.18);
    color: #ffd47a;
    border-color: rgba(214, 154, 55, 0.55);
}
.status-pill.is-ready {
    background: rgba(157, 216, 126, 0.3);
    color: #f5ffd6;
    border-color: rgba(157, 216, 126, 0.85);
    animation: pulse-ready 1.4s ease-in-out infinite;
}
@keyframes pulse-ready {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.04); }
}

.seed-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    background: rgba(0, 0, 0, 0.32);
    border: 1px solid rgba(157, 216, 126, 0.42);
    border-radius: 999px;
    color: #eddcb7;
    font-weight: 700;
    font-size: 0.9rem;
}
.seed-pill img {
    width: 24px; height: 24px; image-rendering: pixelated;
}
.seed-fallback {
    font-size: 1.1rem;
}

.growth-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(214, 154, 55, 0.18);
    border-radius: 999px;
    overflow: hidden;
}
.growth-fill {
    height: 100%;
    background: linear-gradient(90deg, rgba(214, 154, 55, 0.85), rgba(157, 216, 126, 0.95));
    transition: width 220ms ease;
}

.harvest-btn {
    cursor: pointer;
    padding: 10px 22px;
    border-radius: 12px;
    border: 1px solid rgba(157, 216, 126, 0.85);
    background: linear-gradient(135deg, rgba(98, 170, 69, 0.95), rgba(41, 90, 39, 0.95));
    color: #f5ffd6;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.5px;
    transition: filter 120ms ease, transform 120ms ease;
    align-self: center;
}
.harvest-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
.harvest-btn:active { transform: translateY(0); }

.harvest-coin {
    margin-left: 8px;
    color: #ffd47a;
}

/* Section */
.field-section {
    margin-top: 6px;
}

.section-title {
    margin: 0 0 10px;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.5px;
    color: rgba(157, 216, 126, 0.92);
    text-align: left;
}

.seed-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

@media (max-width: 640px) { .seed-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 420px) { .seed-grid { grid-template-columns: repeat(2, 1fr); } }

.seed-card {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(201, 150, 84, 0.28);
    border-radius: 12px;
    padding: 10px;
    text-align: center;
    transition: filter 120ms ease, transform 120ms ease, border-color 120ms ease;
}
.seed-card:hover:not(:disabled) {
    filter: brightness(1.10);
    transform: translateY(-1px);
    border-color: rgba(157, 216, 126, 0.55);
}
.seed-card:disabled {
    cursor: not-allowed;
    opacity: 0.4;
    filter: grayscale(0.4);
}
.seed-img {
    width: 36px; height: 36px; image-rendering: pixelated; margin-bottom: 4px;
}
.seed-name {
    font-size: 12px;
    font-weight: 700;
    color: #eddcb7;
}
.seed-cost {
    font-size: 10px;
    color: rgba(228, 215, 191, 0.7);
    margin-top: 4px;
}
.cost-x { color: #ffd47a; font-weight: 700; }
.cost-have { color: rgba(157, 216, 126, 0.9); }

.empty-msg {
    margin: 14px 0 0;
    color: rgba(228, 215, 191, 0.7);
    font-style: italic;
}

.harvest-flash {
    margin: 16px 0 0;
    font-family: 'Press Start 2P', monospace;
    color: #ffd47a;
    animation: flash-pop 1.2s ease;
}
@keyframes flash-pop {
    0%   { transform: scale(0.6); opacity: 0; }
    20%  { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
}
</style>
