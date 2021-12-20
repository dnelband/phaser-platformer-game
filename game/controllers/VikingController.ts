import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "../scenes/EventsCenter";

export default class VikingController {
    
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    private speed = 1;
    private health = 2;
    private attackNumber = 1;
    private direction = "left";
    private moveTime = 0;
    private waitTime = 0;
    private nextSwitchPoint = Phaser.Math.Between(200,1000);

    constructor(sprite:Phaser.Physics.Matter.Sprite){
 
        this.sprite = sprite;
        this.sprite.setRectangle(this.sprite.width * 0.4 , this.sprite.height * 0.8);
        this.createAnimations();

        this.stateMachine = new StateMachine(this,'viking')

        this.stateMachine.addState('idle', {
            onEnter:this.idleOnEnter,
            onUpdate:this.idleOnUpdate
        })
        .addState('move',{
            onEnter:this.moveOnEnter,
            onUpdate:this.moveOnUpdate
        })
        // .addState('jump',{
        //     onEnter:this.jumpOnEnter,
        //     onUpdate:this.jumpOnUpdate
        // })
        // .addState('fall',{
        //     onEnter:this.fallOnEnter,
        //     onUpdate:this.fallOnUpdate
        // })
        // .addState('attack',{
        //     onEnter:this.attackOnEnter,
        //     onUpdate:this.attackOnUpdate
        // })
        // .addState('jump-attack',{
        //     onEnter:this.jumpAttackOnEnter,
        //     onUpdate:this.jumpAttackOnUpdate
        // })
        .setState('idle')

        this.sprite.setOnCollide((data: any) => {

            const viking = data.bodyB as MatterJS.BodyType;
            const body = data.bodyA as MatterJS.BodyType;
            const gameObject = body.gameObject;

            if (gameObject.tile?.layer.name === "platforms"){
                // console.log(gameObject.tile.properties,"tile game object position");
                if (gameObject.tile.properties?.wall === true){
                    this.direction = this.direction === "left" ? "right" : "left";
                    this.moveTime = 0;
                    this.nextSwitchPoint = Phaser.Math.Between(200,1000)
                }
                // if (viking.gameObject,body.position.x === body.position.x){
                //     console.log('viking is on tile')
                // } else {
                //     console.log('viking faces tile');
                // }
                // console.log(data.bodyA.position,"tile position");
                // console.log(data.bodyB.gameObject.body.position,"viking poition");
                // console.log(viking.gameObject.height,'viking height')
            }


        })
    }

    update(dt:number){
        this.sprite.setAngle(0)
        this.stateMachine.update(dt)
    }

    private idleOnEnter(){

        const w = Phaser.Math.Between(0,100);
        this.waitTime = w;
        this.sprite.anims.play('idle')
        // const r = Phaser.Math.Between(0,100)
        // if (r <= 50) this.direction = "left"
        // else this.direction = "right"

    }

    private idleOnUpdate(dt:number){
        this.waitTime += dt;
        if (this.waitTime >= this.nextSwitchPoint){
            this.waitTime = 0;
            this.stateMachine.setState('move')
        }
    }

    private moveOnEnter(){  
        this.sprite.anims.play('walk', true)
    }

    private moveOnUpdate(dt:number){
        this.sprite.flipX = this.direction === "left" ? true : false
        const velocityX = this.direction === "left" ? this.speed * -1 : this.speed
        this.sprite.setVelocityX(velocityX);
    }

    private jumpOnEnter(){
        this.sprite.anims.play('jump')
        this.sprite.setVelocityY(-8)
    }

    private jumpOnUpdate(){
        console.log('jump on update');
    }

    private takeDamageEnter(){
        this.sprite.anims.play('hit');
        --this.health;
    }

    private takeDamageUpdate(){
        this.stateMachine.setState('idle')
    }

    private attackOnEnter(){
        this.sprite.anims.play(`attack${this.attackNumber}`)
    }

    private attackOnUpdate(){

    }

    private createAnimations() {
        
        this.sprite.anims.create({
            key:'idle',
            frames:this.sprite.anims.generateFrameNames('viking',{start:1,end:6,prefix:'ready_',suffix:'.png'}),
            repeat:-1,
            frameRate:7
        })
    
        this.sprite.anims.create({
            key:'walk',
            frames:this.sprite.anims.generateFrameNames('viking',{start:1,end:6,prefix:'walk_',suffix:'.png'}),
            repeat:-1,
            frameRate:7
        })

        this.sprite.anims.create({
            key:'run',
            frames:this.sprite.anims.generateFrameNames('viking',{start:1,end:6,prefix:'run_',suffix:'.png'}),
            repeat:-1,
            frameRate:15
        })
    
        this.sprite.anims.create({
            key:'attack1',
            frames:this.sprite.anims.generateFrameNames('viking',{start:1,end:6,prefix:'attack1_',suffix:'.png'}),
            frameRate:15
        })
    
        this.sprite.anims.create({
            key:'attack2',
            frames:this.sprite.anims.generateFrameNames('viking',{start:1,end:6,prefix:'attack2_',suffix:'.png'}),
            frameRate:15
        })

        this.sprite.anims.create({
            key:'dead',
            frames:this.sprite.anims.generateFrameNames('viking',{start:1,end:4,prefix:'dead_',suffix:'.png'}),
            frameRate:15
        })
    
        this.sprite.anims.create({
            key:'jump',
            frames:this.sprite.anims.generateFrameNames('viking',{start:1,end:5,prefix:'jump_',suffix:'.png'}),
            frameRate:12
        })

        this.sprite.anims.create({
            key:'hit',
            frames:this.sprite.anims.generateFrameNames('viking',{start:1,end:3,prefix:'hit_',suffix:'.png'}),
            frameRate:12
        })

        this.sprite.anims.create({
            key:'roll',
            frames:this.sprite.anims.generateFrameNames('viking',{start:1,end:6,prefix:'roll_',suffix:'.png'}),
            frameRate:12
        })

        this.sprite.anims.create({
            key:'run',
            frames:this.sprite.anims.generateFrameNames('viking',{start:1,end:6,prefix:'run_',suffix:'.png'}),
            frameRate:12
        })

    }
}