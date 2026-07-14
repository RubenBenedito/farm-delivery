<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { PRODUCTS } from '../items/products.js';

const props = defineProps({
    open: Boolean,
    text: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close']);

const t = computed(() => props.text?.cabinMenu ?? {});
const sectionT = computed(() => props.text?.barnMenu?.sections ?? {});

const inventory = reactive({});
const orders = ref([]);

const lastDelivered = ref(null);
const flashTimers = new Map();

function flash(id) {
    lastDelivered.value = id;

    // Limpa timer
    if (flashTimers.has(id)) {
        clearTimeout(flashTimers.get(id));
    }

    const timerId = setTimeout(() => {
        if (lastDelivered.value === id) lastDelivered.value = null;
        flashTimers.delete(id);
    }, 1400);

    flashTimers.set(id, timerId);
}

function syncInventory() {
    const scene = window.game?.scene?.keys?.GameScene;
    for (const id in PRODUCTS) {
        inventory[id] = scene?.harvest?.[id] ?? 0;
    }
}

// Sincroniza os pedidos
function syncOrders() {
    const scene = window.game?.scene?.keys?.GameScene;
    orders.value = (scene?.orders ?? []).slice();
}

const money = ref(window.game?.scene?.keys?.GameScene?.money ?? 0);

function refreshMoney() {
    const scene = window.game?.scene?.keys?.GameScene;
    if (scene) money.value = scene.money;
}

onMounted(() => {
    syncInventory();
    syncOrders();
    refreshMoney();
});

watch(() => props.open, (isOpen) => {
    if (isOpen) {
        syncInventory();
        syncOrders();
        refreshMoney();
    }
});

// Preço de venda
function sellPriceOf(order) {
    if (typeof order?.pricePerUnit === 'number') return order.pricePerUnit;
    const id = order?.item;
    const base = PRODUCTS[id]?.buyPrice ?? 2;
    const [minR, maxR] = PRODUCTS[id]?.sellRange ?? [base * 2, base * 2 + 2];
    return Math.max(minR, Math.min(maxR, base + 2));
}

// Entrega um pedido, se houver stock suficiente
function deliver(order) {
    const scene = window.game?.scene?.keys?.GameScene;
    if (!scene) return;

    const id = order.item;
    const qty = order.quantity;
    const pricePerUnit = sellPriceOf(order);

    // Vende a partir dos produtos colhidos
    if ((scene.harvest?.[id] ?? 0) >= qty) {
        scene.harvest[id] -= qty;
        scene.money += qty * pricePerUnit;

        // Sincroniza o inventário
        inventory[id] = scene.harvest[id];
        money.value = scene.money;

        order.delivered = true;
        flash(order.id);

        syncOrders();
    }
}

function close() {
    emit('close');
}

function productImage(item) {
    return PRODUCTS[item]?.image ?? null;
}

function productName(item) {
    return props.text?.barnMenu?.harvestProducts?.[item] ?? item;
}

function safeWidth(order) {
    const have = inventory[order.item] ?? 0;
    const need = order.quantity || 1;
    return Math.max(0, Math.min(100, (have / need) * 100));
}
</script>

<template>
    <div class="cabin-overlay" :class="{ 'is-open': open }" @click.self="close">
        <div class="cabin-frame">
            <button class="cabin-close-x" @click="close" :aria-label="t.close">×</button>

            <header class="cabin-header">
                <h1>{{ t.title }}</h1>
                <p>{{ t.description }}</p>
            </header>

            <section v-if="orders.length === 0" class="cabin-empty">
                <div class="empty-emoji">🌿</div>
                <p class="empty-title">{{ t.empty }}</p>
                <p class="empty-sub">{{ t.emptyHint }}</p>
            </section>

            <section v-else class="cabin-list">
                <div
                    v-for="order in orders"
                    :key="order.id"
                    class="order-card"
                    :class="{ 'is-done': order.delivered, 'is-flash': lastDelivered === order.id }" >
                    <div class="order-icon">
                        <img v-if="productImage(order.item)" :src="productImage(order.item)" :alt="productName(order.item)" />
                        <span v-else class="order-icon-fallback">📦</span>
                    </div>

                    <div class="order-body">
                        <div class="order-line">
                            <span class="order-label">{{ t.asking }}</span>
                            <strong class="order-qty">{{ order.quantity }}</strong>
                            <span class="order-of">×</span>
                            <span class="order-name">{{ productName(order.item) }}</span>
                        </div>

                        <div class="order-stock">
                            <span class="stock-label">{{ t.have }}</span>
                            <div class="stock-bar">
                                <div
                                    class="stock-fill"
                                    :class="{ 'is-good': (inventory[order.item] ?? 0) >= order.quantity,
                                        'is-low': (inventory[order.item] ?? 0) < order.quantity  }"
                                    :style="{ width: safeWidth(order) + '%' }" >
                                </div>
                            </div>
                            <span
                                class="stock-count"
                                :class="{ 'is-good': (inventory[order.item] ?? 0) >= order.quantity,
                                    'is-low': (inventory[order.item] ?? 0) < order.quantity}" >
                            {{ inventory[order.item] ?? 0 }} / {{ order.quantity }}</span>
                        </div>
                    </div>

                    <div class="order-action">
                        <span v-if="order.delivered" class="done-pill">
                            <span class="done-tick">✔</span> {{ t.delivered }}
                        </span>
                        <button v-else class="deliver-btn" :disabled="(inventory[order.item] ?? 0) < order.quantity" @click="deliver(order)" >
                            <span class="deliver-label">{{ t.deliver }}</span>
                            <span class="deliver-coin">+{{ order.quantity * sellPriceOf(order) }} ●</span>
                        </button>
                    </div>
                </div>
            </section>

            <footer class="cabin-footer">
                <span class="wallet">💰 {{ money }}</span>
                <span class="counter">📜 {{ orders.length }} {{ t.active }}</span>
            </footer>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.cabin-overlay,
.cabin-overlay * { box-sizing: border-box; }

.cabin-overlay {
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

.cabin-overlay.is-open { opacity: 1; visibility: visible; }

.cabin-frame {
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

.cabin-close-x {
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
    z-index: 2;
}

.cabin-close-x::before {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px dashed rgba(94, 60, 26, 0.4);
    border-radius: 3px;
    pointer-events: none;
}

.cabin-close-x:hover {
    background: rgba(255, 250, 230, 0.95);
    transform: rotate(-2deg);
}

.cabin-close-x:focus-visible {
    outline: 2px solid #5a7a3a;
    outline-offset: 2px;
}

.cabin-header { margin-top: 6px; margin-bottom: 16px; }
.cabin-icon {
    font-size: 1.7rem;
    margin-bottom: 6px;
    filter: sepia(0.3) saturate(1.2);
}

.cabin-header h1 {
    margin: 0;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: clamp(1.7rem, 4vw, 2.6rem);
    color: #3a2818;
    line-height: 1.05;
}

.cabin-header p {
    margin: 6px 0 0;
    font-family: 'Caveat', cursive;
    font-weight: 500;
    font-size: 1.15rem;
    color: #6b4a2b;
    font-style: italic;
}

.cabin-empty {
    padding: 16px 4px 24px;
}

.empty-emoji {
    font-size: 2.4rem;
    margin-bottom: 10px;
    filter: sepia(0.3) saturate(1.2);
}

.empty-title {
    margin: 0;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 1.6rem;
    color: #5a7a3a;
}

.empty-sub {
    margin: 8px 0 0;
    color: #6b4a2b;
    font-size: 1rem;
    font-family: 'Crimson Pro', serif;
    font-style: italic;
}

.cabin-list {
    margin-top: 4px;
    display: grid;
    gap: 12px;
}

.section-title {
    margin: 6px 0 6px;
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

.order-card {
    position: relative;
    display: grid;
    grid-template-columns: 56px 1fr auto;
    gap: 12px;
    align-items: center;
    background: rgba(255, 251, 235, 0.85);
    border: 1.5px dashed rgba(94, 60, 26, 0.5);
    border-radius: 8px;
    padding: 14px 16px 12px;
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
}

.order-card::before {
    content: '';
    position: absolute;
    top: -7px;
    left: 20px;
    transform: rotate(-4deg);
    width: 40px;
    height: 14px;
    background:
        repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.20) 0, rgba(255, 255, 255, 0.20) 2px, transparent 2px, transparent 5px),
        linear-gradient(180deg, #d9a64a 0%, #b8893a 100%);
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.order-card:hover {
    border-color: #5a7a3a;
    background: rgba(255, 251, 235, 0.95);
    transform: translateY(-1px);
}

.order-card.is-done {
    opacity: 0.55;
    border-color: rgba(90, 122, 58, 0.6);
    background: rgba(202, 236, 159, 0.25);
}

.order-card.is-flash {
    animation: order-flash 1.2s ease;
}

@keyframes order-flash {
    0%, 100% { box-shadow: 0 0 0 rgba(90, 122, 58, 0); }
    25% {
        box-shadow: 0 0 0 6px rgba(90, 122, 58, 0.35);
        border-color: rgba(90, 122, 58, 0.85);
    }
    75% { box-shadow: 0 0 0 12px rgba(90, 122, 58, 0); }
}

.order-icon {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    background: rgba(94, 60, 26, 0.10);
    border: 1.5px dashed rgba(94, 60, 26, 0.4);
    display: grid;
    place-items: center;
}

.order-icon img {
    width: 36px;
    height: 36px;
    image-rendering: pixelated;
}

.order-icon-fallback {
    font-size: 1.4rem;
}

.order-body {
    display: grid;
    gap: 6px;
    text-align: left;
    min-width: 0;
}

.order-line {
    font-size: 0.98rem;
    color: #3a2818;
    line-height: 1.25;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px;
    font-family: 'Crimson Pro', serif;
}

.order-label {
    color: #6b4a2b;
    font-style: italic;
}

.order-qty {
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 1.3rem;
    color: #b1493a;
    margin-right: 2px;
}

.order-of {
    color: rgba(94, 60, 26, 0.5);
    margin: 0 4px 0 2px;
}

.order-name {
    color: #3a2818;
    font-weight: 700;
}

.order-stock {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 8px;
    font-size: 12px;
}

.stock-label {
    color: #6b4a2b;
    font-family: 'Crimson Pro', serif;
}

.stock-bar {
    height: 8px;
    background: rgba(94, 60, 26, 0.10);
    border: 1.5px dashed rgba(94, 60, 26, 0.3);
    border-radius: 999px;
    overflow: hidden;
    position: relative;
}

.stock-fill {
    height: 100%;
    background: linear-gradient(90deg, rgba(90, 122, 58, 0.85), rgba(106, 142, 68, 0.95));
    transition: width 220ms ease, background 220ms ease;
}

.stock-fill.is-low {
    background: linear-gradient(90deg, rgba(217, 166, 74, 0.8), rgba(184, 137, 58, 0.95));
}

.stock-count {
    font-weight: 700;
    color: #5a7a3a;
    font-variant-numeric: tabular-nums;
    font-family: 'Crimson Pro', serif;
}

.stock-count.is-low {
    color: #b8893a;
}

.deliver-btn {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-width: 110px;
    padding: 8px 14px;
    cursor: pointer;
    border: 2px solid #5a1810;
    background:
        repeating-linear-gradient(45deg, rgba(255, 230, 200, 0.08) 0, rgba(255, 230, 200, 0.08) 4px, transparent 4px, transparent 8px),
        linear-gradient(180deg, #c14a3e 0%, #9a3a2e 60%, #7c2a22 100%);
    color: #f9edd1;
    border-radius: 4px;
    font-family: 'Caveat', cursive;
    font-size: 1.15rem;
    font-weight: 700;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
    box-shadow:
        0 2px 0 rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.18);
    transition: transform 180ms ease, filter 180ms ease;
}

.deliver-btn:hover:not(:disabled) {
    transform: rotate(-1.5deg) translateY(-1px);
    filter: brightness(1.06);
}

.deliver-btn:active:not(:disabled) { transform: translateY(0); }
.deliver-btn:disabled {
    cursor: not-allowed;
    opacity: 0.4;
    filter: grayscale(0.4);
}

.deliver-label { letter-spacing: 0.04em; }
.deliver-coin {
    font-size: 11px;
    color: #d9a64a;
    letter-spacing: 0.04em;
    font-family: 'Crimson Pro', serif;
}

.done-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(202, 236, 159, 0.4);
    border: 1.5px dashed rgba(90, 122, 58, 0.6);
    color: #2e4a18;
    font-size: 1.05rem;
    font-weight: 700;
    font-family: 'Caveat', cursive;
}

.done-tick {
    color: #5a7a3a;
    font-size: 14px;
}

.cabin-footer {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1.5px dashed rgba(94, 60, 26, 0.4);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    font-family: 'Caveat', cursive;
    font-weight: 700;
}

.wallet { color: #5a7a3a; }
.counter {
    color: #6b4a2b;
    font-family: 'Crimson Pro', serif;
    font-style: italic;
    font-weight: 600;
}

@media (max-width: 600px) {
    .order-card {
        grid-template-columns: 44px 1fr;
    }
    .order-action {
        grid-column: 1 / -1;
        display: flex;
        justify-content: flex-end;
    }
    .cabin-footer {
        flex-direction: column;
        gap: 6px;
    }
}
</style>
