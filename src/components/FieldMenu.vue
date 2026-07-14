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
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.field-overlay,
.field-overlay * { box-sizing: border-box; }

.field-overlay {
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

.field-overlay.is-open { opacity: 1; visibility: visible; }

.field-frame {
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
    padding: 28px 28px 22px;
    text-align: center;
}

.field-close-x {
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
.field-close-x::before {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px dashed rgba(94, 60, 26, 0.4);
    border-radius: 3px;
    pointer-events: none;
}
.field-close-x:hover {
    background: rgba(255, 250, 230, 0.95);
    transform: rotate(-2deg);
}
.field-close-x:focus-visible {
    outline: 2px solid #5a7a3a;
    outline-offset: 2px;
}

.field-header { margin-top: 6px; margin-bottom: 16px; }
.field-icon {
    font-size: 1.8rem;
    margin-bottom: 6px;
    filter: sepia(0.3) saturate(1.2);
}
.field-header h1 {
    margin: 0;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: clamp(1.7rem, 4vw, 2.6rem);
    color: #3a2818;
    line-height: 1.05;
}
.field-header p {
    margin: 6px 0 0;
    font-family: 'Caveat', cursive;
    font-weight: 500;
    font-size: 1.15rem;
    color: #6b4a2b;
    font-style: italic;
}

.field-status {
    position: relative;
    background: rgba(255, 251, 235, 0.85);
    border: 1.5px dashed rgba(94, 60, 26, 0.5);
    border-radius: 8px;
    padding: 14px 16px 12px;
    margin-bottom: 14px;
    display: grid;
    gap: 10px;
    text-align: left;
}
.field-status::before {
    content: '';
    position: absolute;
    top: -7px;
    left: 50%;
    transform: translateX(-50%) rotate(-2deg);
    width: 40px;
    height: 14px;
    background:
        repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.20) 0, rgba(255, 255, 255, 0.20) 2px, transparent 2px, transparent 5px),
        linear-gradient(180deg, #d9a64a 0%, #b8893a 100%);
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}
.status-label {
    color: #6b4a2b;
    font-size: 0.95rem;
    font-family: 'Crimson Pro', serif;
    font-style: italic;
    text-transform: none;
    letter-spacing: 0;
}

.status-pill {
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 1.15rem;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(94, 60, 26, 0.10);
    color: #3a2818;
    border: 1.5px dashed rgba(94, 60, 26, 0.4);
}
.status-pill.is-growing {
    background: rgba(217, 166, 74, 0.25);
    color: #b8893a;
    border-color: rgba(184, 137, 58, 0.6);
}
.status-pill.is-ready {
    background: rgba(202, 236, 159, 0.5);
    color: #2e4a18;
    border-color: rgba(90, 122, 58, 0.8);
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
    background: rgba(94, 60, 26, 0.10);
    border: 1.5px dashed rgba(94, 60, 26, 0.4);
    border-radius: 999px;
    color: #3a2818;
    font-weight: 700;
    font-size: 1rem;
    font-family: 'Caveat', cursive;
}
.seed-pill img {
    width: 24px;
    height: 24px;
    image-rendering: pixelated;
}
.seed-fallback {
    font-size: 1.1rem;
}

.growth-bar {
    height: 8px;
    background: rgba(94, 60, 26, 0.10);
    border: 1.5px dashed rgba(94, 60, 26, 0.3);
    border-radius: 999px;
    overflow: hidden;
}
.growth-fill {
    height: 100%;
    background: linear-gradient(90deg, rgba(217, 166, 74, 0.85), rgba(106, 142, 68, 0.95));
    transition: width 220ms ease;
}

.harvest-btn {
    cursor: pointer;
    padding: 10px 24px;
    border-radius: 6px;
    border: 2px solid #5a1810;
    background:
        repeating-linear-gradient(45deg, rgba(255, 230, 200, 0.08) 0, rgba(255, 230, 200, 0.08) 4px, transparent 4px, transparent 8px),
        linear-gradient(180deg, #c14a3e 0%, #9a3a2e 60%, #7c2a22 100%);
    color: #f9edd1;
    font-family: 'Caveat', cursive;
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
    box-shadow:
        0 3px 0 rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.18);
    transition: transform 180ms ease, filter 180ms ease;
    align-self: center;
}
.harvest-btn:hover {
    transform: rotate(-1.5deg) translateY(-1px);
    filter: brightness(1.06);
}
.harvest-btn:active { transform: translateY(0); }

.harvest-coin {
    margin-left: 8px;
    color: #d9a64a;
    font-family: 'Crimson Pro', serif;
}

.field-section { margin-top: 6px; }
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

.seed-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}
@media (max-width: 640px) { .seed-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 420px) { .seed-grid { grid-template-columns: repeat(2, 1fr); } }

.seed-card {
    cursor: pointer;
    background: rgba(255, 251, 235, 0.85);
    border: 1.5px dashed rgba(94, 60, 26, 0.5);
    border-radius: 6px;
    padding: 12px 8px 10px;
    text-align: center;
    transition: transform 180ms ease, border-color 180ms ease;
}
.seed-card:hover:not(:disabled) {
    border-color: #5a7a3a;
    transform: translateY(-1px) rotate(-0.5deg);
}
.seed-card:disabled {
    cursor: not-allowed;
    opacity: 0.4;
    filter: grayscale(0.4);
}
.seed-img {
    width: 36px;
    height: 36px;
    image-rendering: pixelated;
    margin-bottom: 4px;
}
.seed-name {
    font-size: 12px;
    font-weight: 700;
    color: #3a2818;
    font-family: 'Crimson Pro', serif;
}
.seed-cost {
    font-size: 1.05rem;
    color: #5a7a3a;
    margin-top: 4px;
    font-family: 'Caveat', cursive;
    font-weight: 700;
}
.cost-x { color: #b1493a; }
.cost-have {
    color: #6b4a2b;
    font-family: 'Crimson Pro', serif;
    font-weight: 600;
}

.empty-msg {
    margin: 14px 0 0;
    color: #6b4a2b;
    font-style: italic;
    font-family: 'Crimson Pro', serif;
}

.harvest-flash {
    margin: 16px 0 0;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 1.4rem;
    color: #b1493a;
    animation: flash-pop 1.2s ease;
}
@keyframes flash-pop {
    0%   { transform: scale(0.6); opacity: 0; }
    20%  { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
}
</style>
