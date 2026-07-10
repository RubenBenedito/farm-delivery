import { PLAYER_CONFIG } from './playerConfig.js';

export function updatePlayerMovement(scene, player) {
    const keys = scene.keys;
    const speed = PLAYER_CONFIG.SPEED;

    player.setVelocity(0);

    let moved = false;

    if (keys.left.isDown) {
        player.setVelocityX(-speed);
        player.anims.play('walk-left', true);
        player.direction = 'left';
        moved = true;
    }
    else if (keys.right.isDown) {
        player.setVelocityX(speed);
        player.anims.play('walk-right', true);
        player.direction = 'right';
        moved = true;
    }
    else if (keys.up.isDown) {
        player.setVelocityY(-speed);
        player.anims.play('walk-up', true);
        player.direction = 'up';
        moved = true;
    }
    else if (keys.down.isDown) {
        player.setVelocityY(speed);
        player.anims.play('walk-down', true);
        player.direction = 'down';
        moved = true;
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

    // Som do movimento
    updateMoveSound(scene, player, moved);
}


function updateMoveSound(scene, player, moved) {
    // Som não carregado 
    if (!scene.cache.audio.exists('effect-step')) {
        return;
    }

    if (moved) {
        // Criar o som
        if (!player.moveSound) {
            player.moveSound = scene.sound.add('effect-step', {
                loop: true,
                volume: PLAYER_CONFIG.WALK_SOUND_VOLUME
            });
        }

        if (!player.moveSound.isPlaying) {
            player.moveSound.play();
        }
    } else {
        // Parar o som
        if (player.moveSound?.isPlaying) {
            player.moveSound.stop();
        }
    }
}
