<script setup>
import { computed } from 'vue';

const props = defineProps({
    text: Object,
    musicVolume: Number,
    stepVolume: Number
});

const emit = defineEmits(['change-music', 'change-step']);

const musicPct = computed(() => Math.round((props.musicVolume ?? 0) * 100));
const stepPct  = computed(() => Math.round((props.stepVolume  ?? 0) * 100));

function onMusicInput(e) { emit('change-music', Number(e.target.value) / 100); }
function onStepInput(e)  { emit('change-step',  Number(e.target.value) / 100); }
</script>


<template>
    <div class="settings-grid">

        <section class="setting-card tilt-left">
            <span class="washi" aria-hidden="true"></span>
            <h3>
                <span class="title-bullet">♬</span>
                {{ text.mainMenu.settings.music }}
            </h3>
            <div class="slider-row">
                <input
                    type="range"
                    min="0" max="100" step="1"
                    :value="musicPct"
                    :style="{ '--fill': musicPct + '%' }"
                    @input="onMusicInput"
                    class="ink-slider"
                    :aria-label="text.mainMenu.settings.music"
                />
                <span class="value-pill">{{ musicPct }}%</span>
            </div>
            <p class="hint">{{ text.mainMenu.settings.musicHint }}</p>
        </section>

        <section class="setting-card tilt-right">
            <span class="washi" aria-hidden="true"></span>
            <h3>
                <span class="title-bullet">♬</span>
                {{ text.mainMenu.settings.step }}
            </h3>
            <div class="slider-row">
                <input
                    type="range"
                    min="0" max="100" step="1"
                    :value="stepPct"
                    :style="{ '--fill': stepPct + '%' }"
                    @input="onStepInput"
                    class="ink-slider"
                    :aria-label="text.mainMenu.settings.step"
                />
                <span class="value-pill">{{ stepPct }}%</span>
            </div>
            <p class="hint">{{ text.mainMenu.settings.stepHint }}</p>
        </section>

    </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.settings-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
    padding: 6px;
}


.setting-card {
    position: relative;
    background:
        radial-gradient(ellipse at 80% 12%, rgba(255, 250, 225, 0.6), transparent 50%),
        rgba(255, 251, 235, 0.82);
    border: 1.5px dashed rgba(94, 60, 26, 0.55);
    border-radius: 4px;
    padding: 20px 18px 18px;
    color: #3a2818;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 170px;
    box-shadow:
        0 5px 14px rgba(94, 60, 26, 0.10),
        inset 0 0 20px rgba(167, 130, 80, 0.08);
}

.setting-card.tilt-left  { transform: rotate(-0.8deg); }
.setting-card.tilt-right { transform: rotate(0.8deg); }

.setting-card .washi {
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

.setting-card h3 {
    margin: 0;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 1.55rem;
    color: #3a2818;
    display: flex;
    align-items: center;
    gap: 8px;
}

.title-bullet {
    color: #b1493a;
    font-size: 0.9em;
    transform: rotate(-12deg);
    display: inline-block;
}

.hint {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.35;
    font-family: 'Crimson Pro', serif;
    color: #3a2818;
    opacity: 0.78;
}


.slider-row {
    display: flex;
    align-items: center;
    gap: 14px;
}

.ink-slider {
    flex: 1;
    height: 26px;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    margin: 0;
}

.ink-slider::-webkit-slider-runnable-track {
    height: 10px;
    background:
        linear-gradient(90deg,
            rgba(122, 154, 78, 0.85) 0%,
            rgba(122, 154, 78, 0.85) var(--fill, 50%),
            rgba(255, 248, 220, 0.85) var(--fill, 50%),
            rgba(255, 248, 220, 0.85) 100%);
    border: 1.5px solid #3a2818;
    border-radius: 4px;
    box-shadow: inset 0 1px 2px rgba(94, 60, 26, 0.25);
}

.ink-slider::-moz-range-track {
    height: 10px;
    background:
        linear-gradient(90deg,
            rgba(122, 154, 78, 0.85) 0%,
            rgba(122, 154, 78, 0.85) var(--fill, 50%),
            rgba(255, 248, 220, 0.85) var(--fill, 50%),
            rgba(255, 248, 220, 0.85) 100%);
    border: 1.5px solid #3a2818;
    border-radius: 4px;
    box-shadow: inset 0 1px 2px rgba(94, 60, 26, 0.25);
}

.ink-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #f9edd1, #d8a64a 60%, #6b4a2b 100%);
    border: 2px solid #3a2818;
    margin-top: -10px;
    cursor: grab;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18), inset 0 1px 1px rgba(255, 255, 255, 0.4);
}

.ink-slider::-moz-range-thumb {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #f9edd1, #d8a64a 60%, #6b4a2b 100%);
    border: 2px solid #3a2818;
    cursor: grab;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
}

.ink-slider:active::-webkit-slider-thumb { cursor: grabbing; transform: scale(1.06); }
.ink-slider:focus { outline: none; }
.ink-slider:focus::-webkit-slider-thumb { box-shadow: 0 0 0 3px rgba(193, 74, 62, 0.35), 0 2px 4px rgba(0, 0, 0, 0.18); }


.value-pill {
    display: inline-grid;
    place-items: center;
    min-width: 58px;
    height: 32px;
    padding: 0 10px;
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 1.25rem;
    background: rgba(255, 250, 230, 0.85);
    border: 2px solid #3a2818;
    border-radius: 4px;
    color: #3a2818;
    transform: rotate(-2deg);
    box-shadow:
        inset 0 0 0 2px rgba(58, 40, 24, 0.15),
        1px 1px 0 rgba(58, 40, 24, 0.3);
}


@media (max-width: 900px) {
    .settings-grid { grid-template-columns: 1fr; }
    .setting-card.tilt-left,
    .setting-card.tilt-right { transform: none; }
}
</style>
