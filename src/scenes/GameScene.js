import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.tilemapTiledJSON('map', 'assets/map.tmj');
        this.load.image('tiles', 'assets/summer_outdoorsTileSheet.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('summer_outdoorsTileSheet', 'tiles');

        // Carregar todas as layers
        map.createLayer('ground', tileset, 0, 0);
        map.createLayer('water', tileset, 0, 0);
        map.createLayer('poco', tileset, 0, 0);

        map.createLayer('field1', tileset, 0, 0);
        map.createLayer('field2', tileset, 0, 0);
        map.createLayer('field3', tileset, 0, 0);
        map.createLayer('field4', tileset, 0, 0);
        map.createLayer('field5', tileset, 0, 0);

        map.createLayer('trees', tileset, 0, 0);
        map.createLayer('objects', tileset, 0, 0);
        map.createLayer('buildings', tileset, 0, 0);
        map.createLayer('cliffs', tileset, 0, 0);
        map.createLayer('cascade', tileset, 0, 0);

        // Layer de colisão
        const collisionLayer = map.createLayer('collision', tileset, 0, 0);
        collisionLayer.setCollisionByExclusion([-1]);
    }
}
