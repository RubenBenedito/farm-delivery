import { PLAYER_CONFIG } from './playerConfig.js';

export function updatePlayerMovement(scene, player) {
    const keys = scene.keys;
    const speed = PLAYER_CONFIG.SPEED;

    player.setVelocity(0);

    if (keys.left.isDown) {
        player.setVelocityX(-speed);
        player.anims.play('walk-left', true);
        player.direction = 'left';
    }
    else if (keys.right.isDown) {
        player.setVelocityX(speed);
        player.anims.play('walk-right', true);
        player.direction = 'right';
    }
    else if (keys.up.isDown) {
        player.setVelocityY(-speed);
        player.anims.play('walk-up', true);
        player.direction = 'up';
    }
    else if (keys.down.isDown) {
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
