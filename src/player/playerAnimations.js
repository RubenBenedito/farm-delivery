export function createPlayerAnimations(scene) {
    const anims = scene.anims;

    if (anims.exists('walk-down')) return;

    // Baixo
    anims.create({
        key: 'walk-down',
        frames: anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    // Direita
    anims.create({
        key: 'walk-right',
        frames: anims.generateFrameNumbers('player', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1
    });

    // Cima
    anims.create({
        key: 'walk-up',
        frames: anims.generateFrameNumbers('player', { start: 8, end: 11 }),
        frameRate: 8,
        repeat: -1
    });

    // Esquerda
    anims.create({
        key: 'walk-left',
        frames: anims.generateFrameNumbers('player', { start: 12, end: 15 }),
        frameRate: 8,
        repeat: -1
    });
}
