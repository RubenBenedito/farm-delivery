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

    // Limpa timer anterior deste mesmo id
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

// Preço de venda dinâmico baseado no produto e na quantidade do pedido
function sellPriceOf(order) {
    if (typeof order?.pricePerUnit === 'number') return order.pricePerUnit;
    const id = order?.item;
    const base = PRODUCTS[id]?.seedBasePrice ?? 1;
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
                <div class="cabin-icon" aria-hidden="true">🏪</div>
                <h1>{{ t.title }}</h1>
                <p>{{ t.description }}</p>
            </header>

            <section v-if="orders.length === 0" class="cabin-empty">
                <div class="empty-emoji">🌿</div>
                <p class="empty-title">{{ t.empty }}</p>
                <p class="empty-sub">{{ t.emptyHint }}</p>
            </section>

            <section v-else class="cabin-list">
                <h2 class="section-title">{{ sectionT.harvest }}</h2>

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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Press+Start+2P&display=swap');

.cabin-overlay,
.cabin-overlay * {
    box-sizing: border-box;
}

/* Fundo */
.cabin-overlay {
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
        radial-gradient(circle at 22% 12%, rgba(214, 154, 55, 0.28), transparent 36%),
        radial-gradient(circle at 82% 88%, rgba(66, 131, 81, 0.24), transparent 38%),
        rgba(4, 8, 7, 0.92);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    font-family: 'Outfit', sans-serif;
}

.cabin-overlay.is-open {
    opacity: 1;
    visibility: visible;
}

/* Frame */
.cabin-frame {
    position: relative;
    width: min(720px, 100%);
    max-height: min(86vh, 640px);
    overflow: auto;

    border-radius: 24px;
    border: 1px solid rgba(201, 150, 84, 0.35);
    background: linear-gradient(180deg, rgba(4, 8, 26, 0.98), rgba(2, 6, 18, 0.98));
    box-shadow:
        0 30px 80px rgba(0, 0, 0, 0.55),
        inset 0 1px 0 rgba(255, 213, 119, 0.08);

    padding: 28px 28px 22px;
    text-align: center;

    transform: translateY(8px) scale(0.98);
    opacity: 0;
    transition: transform 220ms ease, opacity 220ms ease;
}

.cabin-overlay.is-open .cabin-frame {
    transform: translateY(0) scale(1);
    opacity: 1;
}

.cabin-close-x {
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
    z-index: 2;
}

.cabin-close-x:hover {
    transform: translateY(-1px);
    filter: brightness(1.15);
    border-color: rgba(157, 216, 126, 0.56);
    color: #d8f4b0;
}

.cabin-close-x:focus-visible {
    outline: 2px solid rgba(157, 216, 126, 0.7);
    outline-offset: 2px;
}

.cabin-header {
    margin-top: 6px;
    margin-bottom: 16px;
}

.cabin-icon {
    font-size: 1.6rem;
    margin-bottom: 6px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

.cabin-header h1 {
    margin: 0;
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(1.05rem, 2.5vw, 1.6rem);
    color: #eddcb7;
    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.45);
}

.cabin-header p {
    margin: 10px 0 0;
    color: rgba(228, 215, 191, 0.76);
    font-size: 1rem;
}

.cabin-empty {
    padding: 16px 4px 24px;
}

.empty-emoji {
    font-size: 2.4rem;
    margin-bottom: 10px;
}

.empty-title {
    margin: 0;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.95rem;
    color: rgba(157, 216, 126, 0.92);
}

.empty-sub {
    margin: 8px 0 0;
    color: rgba(228, 215, 191, 0.7);
    font-size: 0.95rem;
}

/* Lista de pedidos */
.cabin-list {
    margin-top: 4px;
    display: grid;
    gap: 10px;
}

.section-title {
    margin: 6px 0 6px;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.5px;
    color: rgba(157, 216, 126, 0.92);
    text-align: left;
}

/* Cartão de pedido */
.order-card {
    display: grid;
    grid-template-columns: 56px 1fr auto;
    gap: 12px;
    align-items: center;

    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(201, 150, 84, 0.28);
    border-radius: 14px;
    padding: 10px 12px;

    transition: border-color 140ms ease, transform 140ms ease, background 140ms ease;
}

.order-card:hover {
    border-color: rgba(157, 216, 126, 0.45);
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
}

.order-card.is-done {
    opacity: 0.55;
    border-color: rgba(157, 216, 126, 0.32);
    background: rgba(157, 216, 126, 0.07);
}

.order-card.is-flash {
    animation: order-flash 1.2s ease;
}

@keyframes order-flash {
    0%, 100% {
        box-shadow: 0 0 0 rgba(157, 216, 126, 0);
    }
    25% {
        box-shadow: 0 0 0 6px rgba(157, 216, 126, 0.35);
        border-color: rgba(157, 216, 126, 0.85);
    }
    75% {
        box-shadow: 0 0 0 12px rgba(157, 216, 126, 0);
    }
}

.order-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background:
        radial-gradient(circle at 30% 30%, rgba(214, 154, 55, 0.22), transparent 60%),
        rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(201, 150, 84, 0.28);
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
    font-size: 0.95rem;
    color: rgba(228, 215, 191, 0.92);
    line-height: 1.25;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px;
}

.order-label {
    color: rgba(228, 215, 191, 0.72);
}

.order-qty {
    font-family: 'Press Start 2P', monospace;
    font-size: 1.05rem;
    color: #eddcb7;
    margin-right: 2px;
}

.order-of {
    color: rgba(228, 215, 191, 0.45);
    margin: 0 4px 0 2px;
}

.order-name {
    color: #eddcb7;
    font-weight: 700;
}

/* Stock bar */
.order-stock {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 8px;
    font-size: 12px;
}

.stock-label {
    color: rgba(228, 215, 191, 0.7);
}

.stock-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(201, 150, 84, 0.18);
    border-radius: 999px;
    overflow: hidden;
    position: relative;
}

.stock-fill {
    height: 100%;
    background: linear-gradient(90deg, rgba(157, 216, 126, 0.8), rgba(157, 216, 126, 0.95));
    transition: width 220ms ease, background 220ms ease;
}

.stock-fill.is-low {
    background: linear-gradient(90deg, rgba(214, 154, 55, 0.7), rgba(214, 154, 55, 0.95));
}

.stock-count {
    font-weight: 700;
    color: rgba(157, 216, 126, 0.92);
    font-variant-numeric: tabular-nums;
}

.stock-count.is-low {
    color: rgba(214, 154, 55, 0.95);
}

/* Botão entregar */
.deliver-btn {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;

    min-width: 110px;
    padding: 8px 14px;

    cursor: pointer;
    border: 1px solid rgba(157, 216, 126, 0.55);
    background: linear-gradient(135deg, rgba(98, 150, 69, 0.9), rgba(41, 78, 39, 0.92));
    color: #d8f4b0;
    border-radius: 12px;

    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;

    transition: filter 120ms ease, transform 120ms ease, border-color 120ms ease;
}

.deliver-btn:hover:not(:disabled) {
    filter: brightness(1.12);
    transform: translateY(-1px);
    border-color: rgba(157, 216, 126, 0.85);
}

.deliver-btn:active:not(:disabled) {
    transform: translateY(0);
}

.deliver-btn:disabled {
    cursor: not-allowed;
    opacity: 0.4;
    filter: grayscale(0.4);
}

.deliver-label {
    letter-spacing: 0.5px;
}

.deliver-coin {
    font-size: 10px;
    color: #ffd47a;
    letter-spacing: 0.4px;
}

.done-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(157, 216, 126, 0.18);
    border: 1px solid rgba(157, 216, 126, 0.5);
    color: #d8f4b0;
    font-size: 12px;
    font-weight: 700;
}

.done-tick {
    color: #caec9f;
    font-size: 14px;
}

/* Footer */
.cabin-footer {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid rgba(201, 150, 84, 0.28);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
}

.wallet {
    color: #ffd47a;
}

.counter {
    color: rgba(228, 215, 191, 0.72);
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
