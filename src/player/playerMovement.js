import { PLAYER_CONFIG } from './playerConfig.js';

export function updatePlayerMovement(scene, player) {
    const cursors = scene.cursors;
    const speed = PLAYER_CONFIG.SPEED;

    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-speed);
        player.anims.play('walk-left', true);
        player.direction = 'left';
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(speed);
        player.anims.play('walk-right', true);
        player.direction = 'right';
    }
    else if (cursors.up.isDown) {
        player.setVelocityY(-speed);
        player.anims.play('walk-up', true);
        player.direction = 'up';
    }
    else if (cursors.down.isDown) {
        player.setVelocityY(speed);
        player.anims.play('walk-down', true);
        player.direction = 'down';
    }
    else {
        player.anims.stop();

        switch (player.direction) {
            case 'left': player.setFrame(12); break;
            case 'right': player.setFrame(4); break;
            case 'up': player.setFrame(8); break;
            default: player.setFrame(0); break;
        }
    }
}
