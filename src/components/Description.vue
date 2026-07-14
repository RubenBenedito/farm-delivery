<script setup>
const props = defineProps({
    text: Object
});
</script>


<template>
    <section class="description-card">

        <h3 class="entry-title">
            <span class="leaf-mark">❀</span>
            {{ text.mainMenu.descriptionTab }}
            <span class="leaf-mark">❀</span>
        </h3>

        <p class="intro">
            {{ text.mainMenu.description }}
        </p>

        <div class="divider" aria-hidden="true">
            <span class="divider-line"></span>
            <span class="divider-glyph">✦</span>
            <span class="divider-line"></span>
        </div>

        <h4 class="objective-title">
            <span class="stamp-mark" aria-hidden="true">★</span>
            {{ text.mainMenu.objectiveTitle }}
        </h4>

        <p class="objective-text">{{ text.mainMenu.objective }}</p>
    </section>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.description-card {
    position: relative;
    background:
        radial-gradient(ellipse at 12% 10%, rgba(255, 250, 225, 0.55), transparent 50%),
        repeating-linear-gradient(to bottom, transparent 0, transparent 23px, rgba(143, 98, 49, 0.10) 23px, rgba(143, 98, 49, 0.10) 24px),
        rgba(255, 251, 235, 0.78);
    border: 1.5px solid rgba(94, 60, 26, 0.45);
    border-radius: 4px;
    padding: 22px 26px 24px;
    color: #3a2818;
    box-shadow:
        0 4px 14px rgba(94, 60, 26, 0.12),
        inset 0 0 30px rgba(167, 130, 80, 0.10);
    transform: rotate(-0.4deg);
    font-family: 'Crimson Pro', serif;
}

.description-card::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 22px;
    width: 90px;
    height: 20px;
    background:
        repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.20) 0, rgba(255, 255, 255, 0.20) 3px, transparent 3px, transparent 7px),
        linear-gradient(180deg, #d9a64a, #b8893a);
    border-radius: 2px;
    transform: rotate(-3deg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
}

.entry-title {
    margin: 0 0 12px;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 2rem;
    color: #3a2818;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.leaf-mark {
    color: #6a8e44;
    font-size: 1rem;
    opacity: 0.85;
}

.intro {
    margin: 0;
    font-size: 1.08rem;
    line-height: 1.55;
    color: #3a2818;
    text-align: justify;
}

.divider {
    margin: 16px auto 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 80%;
}

.divider-line {
    flex: 1;
    height: 1.5px;
    background: linear-gradient(to right, transparent, rgba(58, 40, 24, 0.6), transparent);
}

.divider-glyph {
    color: #b1493a;
    font-size: 1rem;
}

.objective-title {
    margin: 14px 0 8px;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 1.7rem;
    color: #6b4a2b;
    display: flex;
    align-items: center;
    gap: 8px;
}

.stamp-mark {
    color: #b1493a;
    font-size: 1.2em;
    transform: rotate(-8deg);
    display: inline-block;
}

.objective-text {
    margin: 0;
    font-size: 1.02rem;
    line-height: 1.55;
    color: #3a2818;
}
</style>
