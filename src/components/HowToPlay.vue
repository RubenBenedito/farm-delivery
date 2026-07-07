<script setup>
defineProps({
	text: Object
});
</script>


<template>
    <div class="guide-grid">
        <!-- Movimento -->
        <article class="guide-card">
            <h3>{{ text.mainMenu.sections.movement }}</h3>
            <div class="keys layout-wasd">
                <span class="key up">W</span>
                <span class="key left">A</span>
                <span class="key down">S</span>
                <span class="key right">D</span>
            </div>
            <p>{{ text.mainMenu.guide.movement }}</p>
        </article>

        <!-- Interação -->
        <article class="guide-card">
            <h3>{{ text.mainMenu.sections.interaction }}</h3>
            <div class="keys">
                <span class="key">F</span>
                <span class="key">E</span>
            </div>
            <p>{{ text.mainMenu.guide.interaction }}</p>
        </article>

        <article class="guide-card">
            <h3>{{ text.mainMenu.sections.locations }}</h3>
            <div class="keys">
                <span class="key">F</span>
            </div>
            <p>{{ text.mainMenu.guide.locations }}</p>
        </article>

        <article class="guide-card">
            <h3>{{ text.mainMenu.sections.menu }}</h3>
            <div class="keys">
                <span class="key">ESC</span>
            </div>
            <p>{{ text.mainMenu.guide.menu }}</p>
        </article>
    </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.guide-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
}

.guide-card {
    background: #e2cfa8;
    border-radius: 16px;
    border: 1px solid #b89463;
    padding: 16px 18px;
    color: #4e3924;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.guide-card h3 {
    margin: 0 0 14px;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.95rem;
    text-transform: uppercase;
}

.guide-card p {
    margin: 10px 0 0;
    font-size: 1rem;
    line-height: 1.35;
}

.keys {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.layout-wasd {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: fit-content;
}

.layout-wasd .up {
    grid-column: 2;
}

.layout-wasd .left {
    grid-column: 1;
    grid-row: 2;
}

.layout-wasd .down {
    grid-column: 2;
    grid-row: 2;
}

.layout-wasd .right {
    grid-column: 3;
    grid-row: 2;
}

.key {
    min-width: 52px;
    height: 46px;
    border-radius: 10px;
    display: inline-grid;
    place-items: center;
    padding: 0 12px;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.9rem;
    color: #f9eacd;
    background: linear-gradient(180deg, #885a3d, #5f3923);
    border: 2px solid #3f2417;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.key.wide {
    min-width: 86px;
}

@media (max-width: 900px) {
    .guide-grid {
        grid-template-columns: 1fr;
    }
}
</style>
