import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
    constructor(){
        super('preloader')
    }
    preload(){

        this.load.image('swampbg1','assets/bg/swamp/1.png');
        this.load.image('swampbg2','assets/bg/swamp/2.png');
        this.load.image('swampbg3','assets/bg/swamp/3.png');
        this.load.image('swampbg4','assets/bg/swamp/4.png');
        this.load.image('swampbg5','assets/bg/swamp/5.png');

        this.load.image('tiles','assets/tiles/ice.png');
        this.load.tilemapTiledJSON('ice','assets/tiles/ice-01.json');

        this.load.image('swamp-tiles','assets/tiles/swamp.png');
        this.load.tilemapTiledJSON('swamp','assets/tiles/swamp-01.json');

        this.load.atlas('ninja','assets/characters/ninja.png','assets/characters/ninja.json')
        this.load.atlas('adventurer','assets/characters/adventurer.png','assets/characters/adventurer.json')
        this.load.atlas('viking','assets/characters/viking.png','assets/characters/viking.json')
        
        // this.load.image('tiles','assets/tiles/dungeon_tiles.png');
        this.load.tilemapTiledJSON('dungeon','assets/tiles/dungeon-02.json');
        this.load.image('star','assets/objects/star.png');
        this.load.image('spike','assets/objects/spike.png');
        this.load.image('heart','assets/objects/heart.png');
    }
    create(){
        this.scene.start("game");
    }
}