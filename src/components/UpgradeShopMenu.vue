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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Press+Start+2P&display=swap');

.upgrade-overlay,
.upgrade-overlay * {
    box-sizing: border-box;
}

/* Fundo */
.upgrade-overlay {
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
        radial-gradient(circle at 18% 18%, rgba(214, 154, 55, 0.28), transparent 36%),
        radial-gradient(circle at 82% 82%, rgba(98, 150, 69, 0.24), transparent 38%),
        rgba(4, 8, 7, 0.92);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    font-family: 'Outfit', sans-serif;
}

.upgrade-overlay.is-open {
    opacity: 1;
    visibility: visible;
}

.upgrade-frame {
    position: relative;
    width: min(640px, 100%);
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

.upgrade-overlay.is-open .upgrade-frame {
    transform: translateY(0) scale(1);
    opacity: 1;
}

.upgrade-close-x {
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

.upgrade-close-x:hover {
    transform: translateY(-1px);
    filter: brightness(1.15);
    border-color: rgba(157, 216, 126, 0.56);
    color: #d8f4b0;
}

.upgrade-close-x:focus-visible {
    outline: 2px solid rgba(157, 216, 126, 0.7);
    outline-offset: 2px;
}

.upgrade-header {
    margin-top: 6px;
    margin-bottom: 16px;
}

.upgrade-header h1 {
    margin: 0;
    font-family: 'Press Start 2P', monospace;
    font-size: clamp(1.05rem, 2.5vw, 1.6rem);
    color: #eddcb7;
    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.45);
}

.upgrade-header p {
    margin: 10px 0 0;
    color: rgba(228, 215, 191, 0.76);
    font-size: 1rem;
}

/* Lista de upgrades */
.upgrade-list {
    margin-top: 4px;
    display: grid;
    gap: 10px;
}

.upgrade-card {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-items: center;

    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(201, 150, 84, 0.28);
    border-radius: 14px;
    padding: 12px 14px;

    transition: border-color 140ms ease, transform 140ms ease, background 140ms ease;
}

.upgrade-card:hover {
    border-color: rgba(157, 216, 126, 0.45);
}

.upgrade-card.is-unlocked {
    opacity: 0.55;
    border-color: rgba(157, 216, 126, 0.32);
    background: rgba(157, 216, 126, 0.07);
}

.upgrade-card-info {
    display: grid;
    gap: 4px;
    text-align: left;
    min-width: 0;
}

.upgrade-name {
    color: #eddcb7;
    font-weight: 700;
    font-size: 13px;
}

.upgrade-price {
    color: #ffd47a;
    font-size: 12px;
    font-weight: 700;
}

/* Botão comprar */
.upgrade-buy {
    cursor: pointer;
    border: 1px solid rgba(157, 216, 126, 0.55);
    background: linear-gradient(135deg, rgba(98, 150, 69, 0.9), rgba(41, 78, 39, 0.92));
    color: #d8f4b0;
    border-radius: 12px;

    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;

    padding: 8px 16px;
    transition: filter 120ms ease, transform 120ms ease, border-color 120ms ease;
}

.upgrade-buy:hover:not(:disabled) {
    filter: brightness(1.12);
    transform: translateY(-1px);
    border-color: rgba(157, 216, 126, 0.85);
}

.upgrade-buy:active:not(:disabled) {
    transform: translateY(0);
}

.upgrade-buy:disabled {
    cursor: not-allowed;
    opacity: 0.4;
    filter: grayscale(0.4);
}

.upgrade-done {
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
    letter-spacing: 0.3px;
}

/* Footer */
.upgrade-footer {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid rgba(201, 150, 84, 0.28);
    text-align: right;
    font-size: 14px;
    font-weight: 700;
}

.wallet {
    color: #ffd47a;
}

@media (max-width: 600px) {
    .upgrade-card {
        grid-template-columns: 1fr;
    }

    .upgrade-buy,
    .upgrade-done {
        justify-self: stretch;
    }
}
</style>
