<script setup>
defineProps({
    text: Object
});
</script>


<template>
    <section class="description-card">
        <h3>{{ text.mainMenu.descriptionTab }}</h3>

        <p class="intro">
            {{ text.mainMenu.description }}
        </p>

        <p class="objective">
            <strong>{{ text.mainMenu.objectiveTitle }}:</strong>
            {{ text.mainMenu.objective }}
        </p>
    </section>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.description-card {
    background: #e2cfa8;
    border-radius: 16px;
    border: 1px solid #b89463;
    padding: 20px;
    color: #4e3924;
}

.description-card h3 {
    margin: 0 0 14px;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.95rem;
    text-transform: uppercase;
}

.description-card p {
    margin: 0;
    font-size: 1.02rem;
    line-height: 1.45;
}

/* Espaço antes do objetivo */
.objective {
    margin-top: 22px;
    padding-top: 10px;
    border-top: 1px solid rgba(0,0,0,0.15);
}
</style>
