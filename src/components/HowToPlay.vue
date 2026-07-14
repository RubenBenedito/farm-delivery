<script setup>
const props = defineProps({
    text: Object
});
</script>


<template>
    <div class="guide-grid">
        <!-- Movimento -->
        <article class="guide-card tilt-left">
            <span class="washi" aria-hidden="true"></span>
            <h3>
                <span class="title-bullet">✦</span>
                {{ text.mainMenu.sections.movement }}
            </h3>
            <div class="keys layout-wasd">
                <span class="ink-key">W</span>
                <span class="ink-key skew-left">A</span>
                <span class="ink-key">S</span>
                <span class="ink-key skew-right">D</span>
            </div>
            <p>{{ text.mainMenu.guide.movement }}</p>
        </article>

        <article class="guide-card tilt-right">
            <span class="washi" aria-hidden="true"></span>
            <h3>
                <span class="title-bullet">❖</span>
                {{ text.mainMenu.sections.locations }}
            </h3>
            <div class="keys">
                <span class="ink-key wide">F</span>
            </div>
            <p>{{ text.mainMenu.guide.locations }}</p>
        </article>

        <article class="guide-card tilt-left">
            <span class="washi" aria-hidden="true"></span>
            <h3>
                <span class="title-bullet">✦</span>
                {{ text.mainMenu.sections.menu }}
            </h3>
            <div class="keys">
                <span class="ink-key wide">ESC</span>
            </div>
            <p>{{ text.mainMenu.guide.menu }}</p>
        </article>
    </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.guide-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
    padding: 6px;
}

.guide-card {
    position: relative;
    background:
        radial-gradient(ellipse at 80% 12%, rgba(255, 250, 225, 0.6), transparent 50%),
        rgba(255, 251, 235, 0.82);
    border: 1.5px dashed rgba(94, 60, 26, 0.55);
    border-radius: 4px;
    padding: 22px 20px 18px;
    color: #3a2818;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 12px;
    box-shadow:
        0 5px 14px rgba(94, 60, 26, 0.10),
        inset 0 0 20px rgba(167, 130, 80, 0.08);
}

.guide-card.tilt-left { transform: rotate(-0.8deg); }
.guide-card.tilt-right { transform: rotate(0.8deg); }

.guide-card .washi {
    position: absolute;
    top: -10px;
    right: 18px;
    width: 80px;
    height: 18px;
    background:
        repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.20) 0, rgba(255, 255, 255, 0.20) 3px, transparent 3px, transparent 7px),
        linear-gradient(180deg, #6a8e44 0%, #4a6c2a 100%);
    border-radius: 2px;
    transform: rotate(4deg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);
}

.guide-card:nth-child(2) .washi,
.guide-card:nth-child(3) .washi {
    background:
        repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.22) 0, rgba(255, 255, 255, 0.22) 3px, transparent 3px, transparent 7px),
        linear-gradient(180deg, #c14a3e 0%, #7c2a22 100%);
}

.guide-card h3 {
    margin: 0;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 1.7rem;
    color: #3a2818;
    display: flex;
    align-items: center;
    gap: 8px;
}

.title-bullet {
    color: #b1493a;
    font-size: 0.85em;
    transform: rotate(-12deg);
    display: inline-block;
}

.guide-card p {
    margin: 0;
    font-size: 1.02rem;
    line-height: 1.4;
    font-family: 'Crimson Pro', serif;
    color: #3a2818;
}

.keys {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 4px;
}

.layout-wasd {
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: 8px;
    width: fit-content;
}

.layout-wasd .ink-key:nth-child(1) { grid-column: 2; grid-row: 1; }
.layout-wasd .ink-key:nth-child(2) { grid-column: 1; grid-row: 2; }
.layout-wasd .ink-key:nth-child(3) { grid-column: 2; grid-row: 2; }
.layout-wasd .ink-key:nth-child(4) { grid-column: 3; grid-row: 2; }

.ink-key {
    display: inline-grid;
    place-items: center;
    min-width: 50px;
    height: 46px;
    padding: 0 14px;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 1.5rem;
    color: #3a2818;
    background: rgba(255, 250, 230, 0.7);
    border: 2px solid #3a2818;
    border-radius: 4px;
    position: relative;
    transform: rotate(-2deg);
    transition: transform 160ms ease, background 160ms ease;
    box-shadow:
        inset 0 0 0 2px rgba(58, 40, 24, 0.18),
        1px 1px 0 rgba(58, 40, 24, 0.3);
}

.ink-key::before {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px dashed rgba(58, 40, 24, 0.25);
    border-radius: 2px;
    pointer-events: none;
}

.ink-key:hover {
    transform: rotate(-4deg) translateY(-2px);
    background: rgba(255, 247, 220, 0.95);
}

.ink-key.skew-left { transform: rotate(-4deg); }
.ink-key.skew-right { transform: rotate(3deg); }

.ink-key.wide { min-width: 90px; letter-spacing: 0.06em; }

.ink-key.plus {
    min-width: 38px;
    background: transparent;
    border: none;
    box-shadow: none;
    color: #b1493a;
    font-size: 1.6rem;
}

.ink-key.plus::before { display: none; }

@media (max-width: 900px) {
    .guide-grid { grid-template-columns: 1fr; }
    .guide-card.tilt-left, .guide-card.tilt-right { transform: none; }
}
</style>
