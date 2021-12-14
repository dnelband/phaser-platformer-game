import Phaser from "phaser";
import PlayerController from "./PlayerController";

export default class Game extends Phaser.Scene{

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private ninja: Phaser.Physics.Matter.Sprite;
    private playerController: PlayerController

    constructor(){
        super("game")
    }

    init(){
        this.cursors = this.input.keyboard.createCursorKeys();
        this.scene.launch('ui')
    }

    create(){

        const { width, height } = this.scale;
        
        const map = this.make.tilemap({key:'ice'});
        const tiles = map.addTilesetImage('ice','tiles');

        const platforms = map.createLayer('Platforms',tiles, 0, 0);
        platforms.setCollisionByProperty({collides:"true"})
        
        this.add.image(0, 0, "debug").setOrigin(0, 0);

        this.matter.world.convertTilemapLayer(platforms)

        const objectLayer = map.getObjectLayer('Objects')

        objectLayer.objects.forEach(objData => {
            const { x = 0, y = 0, name, width = 0 } = objData

            switch(name){
                case 'ninja-spawn':
                    this.ninja = this.matter.add.sprite(x + (width * 0.5),y,'ninja','Idle__000.png',{
                        friction:0.001
                    })
                    this.playerController = new PlayerController(this.ninja,this.cursors)
                    this.cameras.main.startFollow(this.ninja);
                    break;
                case 'star':
                    const star = this.matter.add.sprite(x,y,'star',undefined, {
                        isStatic:true,
                        isSensor:true
                    })
                    star.setData('type','star')
                    break;
            }
        })
        
    }

    update(t:number,dt:number){

        if (!this.playerController){
            return
        }
        
        this.playerController.update(dt)
    }
}