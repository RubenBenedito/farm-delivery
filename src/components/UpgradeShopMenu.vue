<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    open: Boolean,
    text: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close']);

function getScene() {
    return window.game?.scene?.keys?.GameScene;
}

const t = computed(() => props.text?.upgradeMenu ?? {});


const upgrades = [
    { id: 'batata',   label: 'Desbloquear Batata',   price: 30 },
    { id: 'couve',    label: 'Desbloquear Couve',    price: 40 },
    { id: 'melancia', label: 'Desbloquear Melancia', price: 50 },

    { id: 'unlock_field3', label: 'Desbloquear Campo 3', price: 75 },
    { id: 'unlock_field4', label: 'Desbloquear Campo 4', price: 100 },
    { id: 'unlock_field5', label: 'Desbloquear Campo 5', price: 115 }
];

const PRODUCT_UNLOCK_IDS = ['batata', 'couve', 'melancia'];
const FIELD_UNLOCK_PREFIX = 'unlock_field';

const money = ref(0);
const refreshTick = ref(0);

// Items e campos desbloqueados
const unlockedHash = computed(() => {
    refreshTick.value;
    const scene = getScene();
    return {
        items: new Set(scene?.unlockedItems ?? []),
        fields: new Set(scene?.unlockedFields ?? [])
    };
});


// Atualiza o estado do menu
function refreshState() {
    const scene = getScene();
    money.value = scene?.money ?? 0;
    refreshTick.value++;
}

// Upgrade comprado
function isUnlocked(upgrade) {
    if (PRODUCT_UNLOCK_IDS.includes(upgrade.id)) {
        return unlockedHash.value.items.has(upgrade.id);
    }
    if (upgrade.id.startsWith(FIELD_UNLOCK_PREFIX)) {
        const fieldId = Number(upgrade.id.replace(FIELD_UNLOCK_PREFIX, ''));
        return unlockedHash.value.fields.has(fieldId);
    }
    return false;
}

// Comprar item ou campo
function buy(upgrade) {
    const scene = getScene();
    if (!scene) return;
    if ((scene.money ?? 0) < upgrade.price) return;

    scene.money -= upgrade.price;

    if (PRODUCT_UNLOCK_IDS.includes(upgrade.id)) {
        scene.unlockedItems = scene.unlockedItems ?? [];
        if (!scene.unlockedItems.includes(upgrade.id)) {
            scene.unlockedItems.push(upgrade.id);
        }
    } else if (upgrade.id.startsWith(FIELD_UNLOCK_PREFIX)) {
        scene.unlockedFields = scene.unlockedFields ?? [];
        const fieldId = Number(upgrade.id.replace(FIELD_UNLOCK_PREFIX, ''));
        if (!scene.unlockedFields.includes(fieldId)) {
            scene.unlockedFields.push(fieldId);
        }
    }

    refreshState();
}


watch(() => props.open, (isOpen) => {
    if (isOpen) refreshState();
}, { immediate: true });


function close() {
    emit('close');
}
</script>

<template>
    <div class="upgrade-overlay" :class="{ 'is-open': open }" @click.self="close">
        <div class="upgrade-frame">
            <button class="upgrade-close-x" @click="close" :aria-label="t.close">×</button>

            <header class="upgrade-header">
                <h1>{{ t.title }}</h1>
                <p>{{ t.description }}</p>
            </header>

            <section class="upgrade-list">
                <article
                    v-for="u in upgrades"
                    :key="u.id"
                    class="upgrade-card"
                    :class="{ 'is-unlocked': isUnlocked(u) }"
                >
                    <div class="upgrade-card-info">
                        <span class="upgrade-name">{{ u.label }}</span>
                        <span class="upgrade-price">● {{ u.price }}</span>
                    </div>

                    <span v-if="isUnlocked(u)" class="upgrade-done">
                        ✔ {{ t.bought || 'Comprado' }}
                    </span>

                    <button
                        v-else
                        class="upgrade-buy"
                        :disabled="money < u.price"
                        @click="buy(u)"
                    >
                        {{ t.buy }}
                    </button>
                </article>
            </section>

            <footer class="upgrade-footer">
                <span class="wallet">💰 {{ money }}</span>
            </footer>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.upgrade-overlay,
.upgrade-overlay * { box-sizing: border-box; }

.upgrade-overlay {
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

.upgrade-overlay.is-open { opacity: 1; visibility: visible; }

.upgrade-frame {
    position: relative;
    width: min(640px, 100%);
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

.upgrade-close-x {
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

.upgrade-close-x::before {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px dashed rgba(94, 60, 26, 0.4);
    border-radius: 3px;
    pointer-events: none;
}

.upgrade-close-x:hover {
    background: rgba(255, 250, 230, 0.95);
    transform: rotate(-2deg);
}

.upgrade-close-x:focus-visible {
    outline: 2px solid #5a7a3a;
    outline-offset: 2px;
}

.upgrade-header { margin-top: 6px; margin-bottom: 16px; }
.upgrade-header h1 {
    margin: 0;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: clamp(1.7rem, 4vw, 2.6rem);
    color: #3a2818;
    line-height: 1.05;
}

.upgrade-header p {
    margin: 6px 0 0;
    font-family: 'Caveat', cursive;
    font-weight: 500;
    font-size: 1.15rem;
    color: #6b4a2b;
    font-style: italic;
}

.upgrade-list {
    margin-top: 4px;
    display: grid;
    gap: 12px;
}

.upgrade-card {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-items: center;
    background: rgba(255, 251, 235, 0.85);
    border: 1.5px dashed rgba(94, 60, 26, 0.5);
    border-radius: 8px;
    padding: 16px 18px 14px;
    transition: transform 180ms ease, border-color 180ms ease;
}

.upgrade-card::before {
    content: '';
    position: absolute;
    top: -7px;
    right: 20px;
    transform: rotate(4deg);
    width: 40px;
    height: 14px;
    background:
        repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.20) 0, rgba(255, 255, 255, 0.20) 2px, transparent 2px, transparent 5px),
        linear-gradient(180deg, #6a8e44 0%, #4a6c2a 100%);
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.upgrade-card:hover {
    border-color: #5a7a3a;
    transform: translateY(-1px);
}

.upgrade-card.is-unlocked {
    opacity: 0.6;
    border-color: rgba(90, 122, 58, 0.6);
    background: rgba(202, 236, 159, 0.2);
}

.upgrade-card-info {
    display: grid;
    gap: 4px;
    text-align: left;
    min-width: 0;
}

.upgrade-name {
    color: #3a2818;
    font-weight: 700;
    font-size: 1.05rem;
    font-family: 'Crimson Pro', serif;
}
.upgrade-price {
    color: #b1493a;
    font-size: 1.1rem;
    font-weight: 700;
    font-family: 'Caveat', cursive;
}

.upgrade-buy {
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
    padding: 8px 20px;
    box-shadow:
        0 2px 0 rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.18);
    transition: transform 180ms ease, filter 180ms ease;
}

.upgrade-buy:hover:not(:disabled) {
    transform: rotate(-1.5deg) translateY(-1px);
    filter: brightness(1.06);
}

.upgrade-buy:active:not(:disabled) { transform: translateY(0); }
.upgrade-buy:disabled {
    cursor: not-allowed;
    opacity: 0.4;
    filter: grayscale(0.4);
}

.upgrade-done {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(202, 236, 159, 0.4);
    border: 1.5px dashed rgba(90, 122, 58, 0.6);
    color: #2e4a18;
    font-size: 1.05rem;
    font-weight: 700;
    font-family: 'Caveat', cursive;
    letter-spacing: 0.04em;
}

.upgrade-footer {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1.5px dashed rgba(94, 60, 26, 0.4);
    text-align: right;
}

.wallet {
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 1.3rem;
    color: #5a7a3a;
}

@media (max-width: 600px) {
    .upgrade-card { grid-template-columns: 1fr; }
    .upgrade-buy, .upgrade-done { justify-self: stretch; }
}
</style>
