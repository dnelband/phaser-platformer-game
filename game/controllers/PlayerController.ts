import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sharedInstance as events } from "../scenes/EventsCenter";
import ObstaclesController from "./ObstaclesController";

export default class PlayerController {
    
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private stateMachine: StateMachine
    private playerSpeed = 1.5;
    private hp = 100;
    private keys: any;
    private attackNumber = 1;
    private isDead: boolean = false;
    private obstacles: ObstaclesController;

    constructor(sprite:Phaser.Physics.Matter.Sprite, cursors:Phaser.Types.Input.Keyboard.CursorKeys,keys:any,obstacles: ObstaclesController,scene:Phaser.Scene){
 
        this.scene = scene;
        this.sprite = sprite;
        this.sprite.setRectangle(this.sprite.width * 0.4 , this.sprite.height * 0.9);
        // this.sprite.setFriction(0)
        // this.sprite.setFrictionStatic(0)
        this.sprite.setSize(32,32)
        this.keys = keys;
        this.cursors = cursors;
        this.obstacles = obstacles;


        this.createAnimations();

        this.stateMachine = new StateMachine(this,'adventurer')

        this.stateMachine.addState('idle', {
            onEnter:this.idleOnEnter,
            onUpdate:this.idleOnUpdate
        })
        .addState('walk',{
            onEnter:this.walkOnEnter,
            onUpdate:this.walkOnUpdate
        })
        .addState('roll',{
            onEnter:this.rollOnEnter,
            onUpdate:this.rollOnUpdate
        })
        .addState('jump',{
            onEnter:this.jumpOnEnter,
            onUpdate:this.jumpOnUpdate
        })
        .addState('fall',{
            onEnter:this.fallOnEnter,
            onUpdate:this.jumpOnUpdate
        })
        .addState('attack',{
            onEnter:this.attackOnEnter,
            onUpdate:this.attackOnUpdate
        })
        .addState('jump-attack',{
            onEnter:this.jumpAttackOnEnter,
            onUpdate:this.jumpAttackOnUpdate
        })
        .addState('spike-hit',{
            onEnter:this.spikeHitOnEnter,
            onUpdate:this.spikeHitOnUpdate
        })
        .addState('die',{
            onEnter:this.dieOnEnter,
            onUpdate:this.dieOnUpdate
        })
        .setState('idle')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
                        
            const body = data.bodyA as MatterJS.BodyType
            const bodyB = data.bodyB as MatterJS.BodyType

            const gameObject = body.gameObject

            console.log(gameObject);

            if (!gameObject){
                return
            }

            if (gameObject instanceof Phaser.Physics.Matter.TileBody){
                if (this.stateMachine.isCurrentState('jump') || 
                    this.stateMachine.isCurrentState('fall') || 
                    this.stateMachine.isCurrentState('jump-attack')) {
                    if (gameObject.tile.properties?.floor === true){
                        this.stateMachine.setState('idle')
                    }
                }
                return
            }

            if (this.obstacles.is('spike', bodyB)){
                this.stateMachine.setState('spike-hit')
            }

            const sprite = bodyB?.gameObject as Phaser.Physics.Matter.Sprite
            const type = sprite?.getData('type')

            switch (type){
                case 'star':
                {
                    events.emit('star-collected');
                    sprite.destroy()
                    break;
                }

                case 'heart':
                {
                    const value = sprite.getData('healthPoints') ?? 10;
                    this.hp = Phaser.Math.Clamp(this.hp + value,0,100);
                    events.emit('health-changed',this.hp)
                    sprite.destroy()
                    break;
                }

            }

        })
    }

    update(dt:number){
        this.sprite.setFixedRotation()
        this.stateMachine.update(dt)
        if (this.hp <= 0 && this.isDead === false){ 
            this.stateMachine.setState('die');
        }
    }

    private idleOnEnter(){
        this.sprite.anims.play('adventurer-idle')
    }

    private idleOnUpdate(){
        
        this.sprite.setTint(0xffffff)

        if (this.sprite.body.velocity.y > 1){
            this.stateMachine.setState('fall');
        } else {

            if (this.keys.attack?.isDown){
                this.stateMachine.setState('attack')
            } else if (this.keys.roll?.isDown){
                this.stateMachine.setState('roll')
            }

            const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
            if (this.cursors.left?.isDown || this.cursors.right?.isDown){ 
                this.stateMachine.setState('walk')
            } else if (spaceJustPressed){
                this.stateMachine.setState('jump')
            }

        }
    }

    private walkOnEnter(){        
        this.sprite.anims.play('adventurer-run', true)
    }

    private walkOnUpdate(){

        if (this.cursors.left?.isDown){
            this.sprite.setVelocityX(-this.playerSpeed)
            this.sprite.flipX = true;
        } else if (this.cursors.right?.isDown){
            this.sprite.setVelocityX(this.playerSpeed)
            this.sprite.flipX = false;
        } else {
            this.sprite.setVelocityX(0)
            this.stateMachine.setState('idle')
        }
        
        if (this.keys.attack?.isDown){
            this.stateMachine.setState('attack')
        } else if (this.keys.roll?.isDown){
            this.stateMachine.setState('roll')
        }

        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (spaceJustPressed){
            this.stateMachine.setState('jump')
        }
    }

    private rollOnEnter(){
        this.sprite.anims.play('adventurer-roll');
        const velocityX = this.sprite.flipX === true ? this.playerSpeed * 4 * -1 : this.playerSpeed * 4;
        this.sprite.setVelocityX(velocityX)
    }

    private rollOnUpdate(){
        if (this.sprite.anims.isPlaying && this.sprite.anims.currentAnim.key === "adventurer-roll"){
            console.log('adventurer is rolling')
        } else {
            this.stateMachine.setState('idle');
        } 
    }

    private jumpOnEnter(){
        this.sprite.anims.play('adventurer-jump')
        this.sprite.setVelocityY(-this.playerSpeed * 6)
    }

    private jumpOnUpdate(){

        if (this.keys.attack?.isDown){
            this.stateMachine.setState('jump-attack')
        }
        
        if (this.cursors.left?.isDown){
            this.sprite.setVelocityX(-this.playerSpeed * 2)
            this.sprite.flipX = true;
        } else if (this.cursors.right?.isDown){
            this.sprite.setVelocityX(this.playerSpeed * 2)
            this.sprite.flipX = false;
        } else {
            this.sprite.setVelocityX(0)
        }
    }

    private fallOnEnter(){
        this.sprite.anims.play('adventurer-fall');
    }

    private takeDamageEnter(){
        --this.hp;
    }

    private takeDamageUpdate(){
        this.stateMachine.setState('idle')
    }

    private attackOnEnter(){
        this.sprite.anims.play(`adventurer-attack${this.attackNumber}`)
    }

    private attackOnUpdate(){
        if (this.sprite.anims.isPlaying && this.sprite.anims.currentAnim.key === `adventurer-attack${this.attackNumber}`) {
            console.log('Player is attacking')
        } else {
            if (this.attackNumber >= 3) this.attackNumber = 1;
            else ++this.attackNumber;
            this.stateMachine.setState('idle');
        }
    }

    private jumpAttackOnEnter(){
        this.sprite.anims.play(`adventurer-jump-attack${this.attackNumber}`)
    }

    private jumpAttackOnUpdate(){
        if (this.sprite.anims.isPlaying && this.sprite.anims.currentAnim.key === `adventurer-jump-attack${this.attackNumber}`) {
            console.log('Player is jump attacking')
        } else {
            if (this.attackNumber >= 3) this.attackNumber = 1;
            else ++this.attackNumber;
            this.stateMachine.setState('fall');
        }
    }

    private spikeHitOnEnter(){
        
        this.sprite.setVelocityY(-8);
        this.sprite.setVelocityX(-this.playerSpeed)
        this.hp = Phaser.Math.Clamp(this.hp - 10,0,100)

        events.emit('health-changed',this.hp)

        const startColor = Phaser.Display.Color.ValueToColor(0xffffff)
        const endColor = Phaser.Display.Color.ValueToColor(0xff0000)

        this.scene.tweens.addCounter({
            from:0,
            to:100,
            duration:100,
            repeat:2,
            yoyo:true,
            onUpdate:tween =>{
                
                const value = tween.getValue();
                
                const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(startColor,endColor,100,value)

                const color = Phaser.Display.Color.GetColor(
                    colorObject.r,
                    colorObject.g,
                    colorObject.a
                )

                this.sprite.setTint(color)
            }
        })
    }

    private spikeHitOnUpdate(){
        // this.sprite.setVelocityY(0)
        this.stateMachine.setState('fall');
    }

    private dieOnEnter(){
        this.isDead = true;
        this.sprite.anims.play('adventurer-die')
    }

    private dieOnUpdate(){
        this.sprite.setTint(0xffffff)
        console.log('player is dead')
    }

    private createAnimations() {
        
        this.sprite.anims.create({
            key:'adventurer-idle',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:4,prefix:'adventurer-idle-0',suffix:'.png'}),
            repeat:-1,
            frameRate:7
        })
    
        this.sprite.anims.create({
            key:'adventurer-walk',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:5,prefix:'adventurer-walk-0',suffix:'.png'}),
            repeat:-1,
            frameRate:7
        })

        this.sprite.anims.create({
            key:'adventurer-run',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:6,prefix:'adventurer-run-0',suffix:'.png'}),
            repeat:-1,
            frameRate:15
        })
    
        this.sprite.anims.create({
            key:'adventurer-attack1',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:4,prefix:'adventurer-attack1-0',suffix:'.png'}),
            frameRate:15
        })
    
        this.sprite.anims.create({
            key:'adventurer-attack2',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:5,prefix:'adventurer-attack2-0',suffix:'.png'}),
            frameRate:15
        })

        this.sprite.anims.create({
            key:'adventurer-attack3',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:5,prefix:'adventurer-attack3-0',suffix:'.png'}),
            frameRate:15
        })

        this.sprite.anims.create({
            key:'adventurer-dead',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:6,prefix:'adventurer-die-0',suffix:'.png'}),
            frameRate:15
        })
    
        this.sprite.anims.create({
            key:'adventurer-jump',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:3,prefix:'adventurer-jump-0',suffix:'.png'}),
            frameRate:12
        })

        this.sprite.anims.create({
            key:'adventurer-fall',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:1,prefix:'adventurer-fall-0',suffix:'.png'}),
            frameRate:12
        })

        this.sprite.anims.create({
            key:'adventurer-jump-attack1',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:3,prefix:'adventurer-air-attack1-0',suffix:'.png'}),
            frameRate:12
        })

        this.sprite.anims.create({
            key:'adventurer-jump-attack2',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:2,prefix:'adventurer-air-attack2-0',suffix:'.png'}),
            frameRate:12
        })

        this.sprite.anims.create({
            key:'adventurer-jump-attack3',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:1,prefix:'adventurer-air-attack3-loop-0',suffix:'.png'}),
            frameRate:12
        })

        this.sprite.anims.create({
            key:'adventurer-roll',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:3,prefix:'adventurer-smrslt-0',suffix:'.png'}),
            frameRate:12
        })

        this.sprite.anims.create({
            key:'adventurer-die',
            frames:this.sprite.anims.generateFrameNames('adventurer',{start:0,end:6,prefix:'adventurer-die-0',suffix:'.png'}),
            frameRate:12
        })

    }
}