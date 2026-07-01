import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.tilemapTiledJSON('map', 'assets/map.tmj');

        // Carregar todos os tilesets usados no Tiled
        this.load.image('Barn', 'assets/Barn.png');
        this.load.image('Big_Shed', 'assets/Big_Shed.png');
        this.load.image('Coop', 'assets/Coop.png');
        this.load.image('fall_Waterfalls', 'assets/fall_Waterfalls.png');
        this.load.image('Log_Cabin', 'assets/Log_Cabin.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('Stone_Cabin', 'assets/Stone_Cabin.png');
        this.load.image('summer_outdoorsTileSheet', 'assets/summer_outdoorsTileSheet.png');
        this.load.image('Well', 'assets/Well.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });

        // Ligar cada tileset ao nome EXATO do Tiled
        const tsBarn = map.addTilesetImage('Barn', 'Barn');
        const tsBigShed = map.addTilesetImage('Big_Shed', 'Big_Shed');
        const tsCoop = map.addTilesetImage('Coop', 'Coop');
        const tsFall = map.addTilesetImage('fall_Waterfalls', 'fall_Waterfalls');
        const tsLogCabin = map.addTilesetImage('Log_Cabin', 'Log_Cabin');
        const tsPlayer = map.addTilesetImage('player', 'player');
        const tsStoneCabin = map.addTilesetImage('Stone_Cabin', 'Stone_Cabin');
        const tsSummer = map.addTilesetImage('summer_outdoorsTileSheet', 'summer_outdoorsTileSheet');
        const tsWell = map.addTilesetImage('Well', 'Well');

        // Lista completa de tilesets
        const allTilesets = [
            tsBarn,
            tsBigShed,
            tsCoop,
            tsFall,
            tsLogCabin,
            tsPlayer,
            tsStoneCabin,
            tsSummer,
            tsWell
        ];

        // Criar todas as layers usando TODOS os tilesets
        map.createLayer('ground', allTilesets, 0, 0);
        map.createLayer('water', allTilesets, 0, 0);
        map.createLayer('poco', allTilesets, 0, 0);

        map.createLayer('field1', allTilesets, 0, 0);
        map.createLayer('field2', allTilesets, 0, 0);
        map.createLayer('field3', allTilesets, 0, 0);
        map.createLayer('field4', allTilesets, 0, 0);
        map.createLayer('field5', allTilesets, allTilesets, 0, 0);

        map.createLayer('trees', allTilesets, 0, 0);
        map.createLayer('objects', allTilesets, 0, 0);
        map.createLayer('buildings', allTilesets, 0, 0);
        map.createLayer('cliffs', allTilesets, 0, 0);
        map.createLayer('cascade', allTilesets, 0, 0);

        const collisionLayer = map.createLayer('colision', allTilesets, 0, 0);
        collisionLayer.setCollisionByExclusion([-1]);
    }
}
