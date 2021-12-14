import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
    constructor(){
        super('preloader')
    }
    preload(){
        this.load.image('icebg','assets/bg/iceworld.jpg');
        this.load.image('tiles','assets/tiles/ice.png');
        this.load.tilemapTiledJSON('ice','assets/tiles/ice-01.json');
        this.load.atlas('ninja','assets/characters/ninja.png','assets/characters/ninja.json')
        // this.load.image('tiles','assets/tiles/dungeon_tiles.png');
        this.load.tilemapTiledJSON('dungeon','assets/tiles/dungeon-02.json');
        this.load.image('star','assets/objects/star.png');
    }
    create(){
        this.scene.start("game");
    }
}