import Phaser from "phaser";
import ObstaclesController from "../controllers/ObstaclesController";
import PlayerController from "../controllers/PlayerController";
import VikingController from "../controllers/VikingController";

export default class Game extends Phaser.Scene{

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private adventurer:  Phaser.Physics.Matter.Sprite;
    private playerController: PlayerController;
    private vikings?: VikingController[] = [];
    private obstacles!: ObstaclesController;

    constructor(){
        super("game")
    }

    init(){
        this.cursors = this.input.keyboard.createCursorKeys();
        this.obstacles = new ObstaclesController();
        this.scene.launch('ui')
        this.vikings = []
    }

    create(){


        const { width, height } = this.scale;
  
        const controlKeys = {
            attack: this.input.keyboard.addKey('CTRL'),
            roll: this.input.keyboard.addKey('B')
        }

        this.add.image(0,0,'swampbg1')
            .setOrigin(0,0)
            .setScrollFactor(0);

        this.add.tileSprite(0,0,width,height,'swampbg4')
            .setOrigin(0,0)
            .setScrollFactor(0,0);

        this.add.tileSprite(0,0,width,height,'swampbg3')
            .setOrigin(0,0)
            .setScrollFactor(0,0);

        this.add.tileSprite(0,0,width,height,'swampbg2')
            .setOrigin(0,0)
            .setScrollFactor(0,0);

        this.add.tileSprite(0,0,width,height,'swampbg5')
            .setOrigin(0,0)
            .setScrollFactor(0,0);

        const map = this.make.tilemap({key:'swamp'});

        const tiles = map.addTilesetImage('swamp','swamp-tiles');

        const platforms = map.createLayer('platforms',tiles, 0, 0);
        platforms.setCollisionByProperty({collides:true})

        map.createLayer('obstacles', tiles)
        
        this.matter.world.convertTilemapLayer(platforms)

        const objectLayer = map.getObjectLayer('objects')

        objectLayer.objects.forEach(objData => {
            const { x = 0, y = 0, name, width = 0, height = 0 } = objData

            switch(name){
                case 'player-spawn':
                    
                    // this.ninja = this.matter.add.sprite(x + (width * 0.5),y,'ninja','Idle__00 0.png',{
                    //     friction:0.001
                    // })
                    // this.playerController = new PlayerController(this.ninja,this.cursors)
                    // this.cameras.main.startFollow(this.ninja);

                    this.adventurer = this.matter.add.sprite(x + (width * 0.5),y,'adventurer','Idle__000.png')
                    this.playerController = new PlayerController(this.adventurer,this.cursors,controlKeys,this.obstacles,this)
                    this.cameras.main.startFollow(this.adventurer);

                    break;
                case 'star':
                    const star = this.matter.add.sprite(x,y,'star',undefined, {
                        isStatic:true,
                        isSensor:true
                    })
                    star.setData('type','star')
                    break;

                case 'health-pill':
                    const heart = this.matter.add.sprite(x,y,'heart',undefined, {
                        isStatic:true,
                        isSensor:true
                    })
                    heart.setData('type','heart')
                    heart.setData('healthPoints',10)
                    break;

                case 'spike':
                    const spike = this.matter.add.rectangle(x + (width * 0.5),y + (height * 0.5),width,height,{
                        isStatic:true
                    })
                    this.obstacles.add('spike',spike)
                    break;

                case 'viking':
                    const viking = this.matter.add.sprite(x,y,'viking','ready_3.png');
                    viking.setData('type','viking')
                    this.vikings.push(new VikingController(viking))
                    break;

            }
        })

        console.log(map);

        // this.physics.world.setBounds(0,0,map.tileWidth * map.width,map.tileHeight * map.height);
        this.cameras.main.setBounds(0,0,map.tileWidth * map.width,map.tileHeight * map.height)
        
    }

    update(t:number,dt:number){
        this.playerController?.update(dt)
        this.vikings.forEach(viking => viking.update(dt))
    }
}