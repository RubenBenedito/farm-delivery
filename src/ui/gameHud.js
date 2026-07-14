export function createHUD(scene, mapWidth, mapHeight) {
    // Tempo inicial
    scene.startTime = scene.time.now;
    scene.gameTime = 0;
    scene.currentDay = 1;


    // Caixa da Esquerda
    scene.timeBox = scene.add.graphics();
    scene.timeBox.setScrollFactor(0);
    scene.timeBox.setDepth(200);

    scene.timeBox.fillStyle(0x000000, 0.6);
    scene.timeBox.lineStyle(2, 0xffffff, 0.3);

    scene.timeBox.fillRoundedRect(10, 10, 100, 60, 10);
    scene.timeBox.strokeRoundedRect(10, 10, 100, 60, 10);

    scene.dayText = scene.add.text(18, 15, `${window.__gameText?.hud?.dayLabel ?? 'DIA'} 1`, {
        fontSize: "22px",
        fill: "#ffffff",
        fontStyle: "bold"
    }).setScrollFactor(0).setDepth(201);

    scene.timeText = scene.add.text(18, 45, "00:00", {
        fontSize: "20px",
        fill: "#ffffff"
    }).setScrollFactor(0).setDepth(201);


    // Caixa da Direita
    scene.moneyBox = scene.add.graphics();
    scene.moneyBox.setScrollFactor(0);
    scene.moneyBox.setDepth(200);

    scene.moneyBox.fillStyle(0x000000, 0.6);
    scene.moneyBox.lineStyle(2, 0xffffff, 0.3);

    const boxWidth = 100;
    const boxHeight = 60;
    const boxX = mapWidth - boxWidth - 10;
    const boxY = 10;

    scene.moneyBox.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 10);
    scene.moneyBox.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 10);

    scene.moneyText = scene.add.text(
        boxX + 15,
        boxY + 20,
        `💰 ${scene.money}`,
        {
            fontSize: "22px",
            fill: "#ffffff",
            fontStyle: "bold"
        }
    )
    .setScrollFactor(0)
    .setDepth(201);


    // Noite
    scene.nightOverlay = scene.add.rectangle(0, 0, mapWidth, mapHeight, 0x000000, 0)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(50);
}


export function updateHUD(scene) {
    if (scene.isPaused) return;

    scene.gameTime = (scene.time.now - scene.startTime) / 1000;

    const DAY_DURATION_SECONDS = 10 * 60;
    const NIGHT_DURATION_SECONDS = 5 * 60;
    const CYCLE_DURATION_SECONDS = DAY_DURATION_SECONDS + NIGHT_DURATION_SECONDS;
    const TRANSITION_DURATION_SECONDS = 30;
    const MAX_NIGHT_ALPHA = 0.6;

    // Tempo
    const cycleTime = scene.gameTime % CYCLE_DURATION_SECONDS;
    scene.currentDay = Math.floor(scene.gameTime / CYCLE_DURATION_SECONDS) + 1;
    const minutes = Math.floor(cycleTime / 60);
    const seconds = Math.floor(cycleTime % 60);

    scene.timeText.setText(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
    scene.dayText.setText(`${window.__gameText?.hud?.dayLabel ?? 'DIA'} ${scene.currentDay}`);
    let nightAlpha = 0;

    if (cycleTime < DAY_DURATION_SECONDS) {
        nightAlpha = 0;
    } else if (cycleTime < DAY_DURATION_SECONDS + TRANSITION_DURATION_SECONDS) {
        const progress = (cycleTime - DAY_DURATION_SECONDS) / TRANSITION_DURATION_SECONDS;
        nightAlpha = MAX_NIGHT_ALPHA * (progress * progress * (3 - 2 * progress));
    } else if (cycleTime < CYCLE_DURATION_SECONDS - TRANSITION_DURATION_SECONDS) {
        nightAlpha = MAX_NIGHT_ALPHA;
    } else {
        const progress = (CYCLE_DURATION_SECONDS - cycleTime) / TRANSITION_DURATION_SECONDS;
        nightAlpha = MAX_NIGHT_ALPHA * (progress * progress * (3 - 2 * progress));
    }

    scene.nightOverlay.setFillStyle(0x000000, nightAlpha);

    scene.moneyText.setText(`💰 ${scene.money}`);
}
