import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";

export default class PlayerController {
    
    private sprite: Phaser.Physics.Matter.Sprite
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private stateMachine: StateMachine
    private playerSpeed = 10
    private playerHealth = 6;

    constructor(sprite:Phaser.Physics.Matter.Sprite, cursors:Phaser.Types.Input.Keyboard.CursorKeys){
 
        this.sprite = sprite
        this.cursors = cursors

        this.createAnimations()

        this.stateMachine = new StateMachine(this,'player')

        this.stateMachine.addState('idle', {
            onEnter:this.idleOnEnter,
            onUpdate:this.idleOnUpdate
        })
        .addState('walk',{
            onEnter:this.walkOnEnter,
            onUpdate:this.walkOnUpdate
        })
        .addState('jump',{
            onEnter:this.jumpOnEnter,
            onUpdate:this.jumpOnUpdate
        })
        .addState('take-damage',{
            onEnter:this.takeDamageEnter,
            onUpdate:this.takeDamageUpdate
        })
        .setState('take-damage')

        this.sprite.setOnCollide((data: any) => {
                        
            const body = data.bodyA as MatterJS.BodyType
            const gameObject = body.gameObject

            if (!gameObject){
                return
            }

            if (gameObject instanceof Phaser.Physics.Matter.TileBody){
                if (this.stateMachine.isCurrentState('jump')) {
                    if ( data.bodyB.position.y + (data.bodyB.gameObject.height / 2) < data.bodyA.position.y){
                        this.stateMachine.setState('idle')
                    }
                }
                return
            }

            const sprite = data.bodyB.gameObject as Phaser.Physics.Matter.Sprite
            const type = sprite.getData('type')

            switch (type){
                case 'star':
                {
                    console.log('collided with star')
                    sprite.destroy()
                    break;
                }
            }

        })
    }

    update(dt:number){
        this.sprite.setAngle(0)
        this.stateMachine.update(dt)
    }

    private idleOnEnter(){
        this.sprite.anims.play('ninja-idle')
    }

    private idleOnUpdate(){
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)

        if (this.cursors.left?.isDown || this.cursors.right?.isDown){ 
            this.stateMachine.setState('walk')
        } else if (spaceJustPressed){
            this.stateMachine.setState('jump')
        }

    }

    private walkOnEnter(){        
        this.sprite.anims.play('ninja-run', true)
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

        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)

        if (spaceJustPressed){
            this.stateMachine.setState('jump')
        }
    }

    private jumpOnEnter(){
        this.sprite.anims.play('ninja-jump')
        this.sprite.setVelocityY(-this.playerSpeed * 1.5)
    }

    private jumpOnUpdate(){        
        if (this.cursors.left?.isDown){
            this.sprite.setVelocityX(-this.playerSpeed)
            this.sprite.flipX = true;
        } else if (this.cursors.right?.isDown){
            this.sprite.setVelocityX(this.playerSpeed)
            this.sprite.flipX = false;
        } else {
            this.sprite.setVelocityX(0)
        }
    }

    private takeDamageEnter(){
        --this.playerHealth;
        console.log(this.playerHealth,'player health')
    }

    private takeDamageUpdate(){
        this.stateMachine.setState('idle')
    }

    private createAnimations() {
        

        this.sprite.anims.create({
            key:'ninja-idle',
            frames:this.sprite.anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Idle__00',suffix:'.png'}),
            repeat:-1,
            frameRate:15
        })
    
        this.sprite.anims.create({
            key:'ninja-run',
            frames:this.sprite.anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Run__00',suffix:'.png'}),
            repeat:-1,
            frameRate:25
        })
    
        this.sprite.anims.create({
            key:'ninja-attack',
            frames:this.sprite.anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Attack__00',suffix:'.png'}),
            frameRate:15
        })
    
        this.sprite.anims.create({
            key:'ninja-throw',
            frames:this.sprite.anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Throw__00',suffix:'.png'}),
            frameRate:15
        })
    
        this.sprite.anims.create({
            key:'ninja-slide',
            frames:this.sprite.anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Slide__00',suffix:'.png'}),
            repeat:-1,
            frameRate:15
        })
    
        this.sprite.anims.create({
            key:'ninja-dead',
            frames:this.sprite.anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Dead__00',suffix:'.png'}),
            frameRate:15
        })
    
        this.sprite.anims.create({
            key:'ninja-jump',
            frames:this.sprite.anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Jump__00',suffix:'.png'}),
            frameRate:7
        })
    
        this.sprite.anims.create({
            key:'ninja-jump-idle',
            frames:this.sprite.anims.generateFrameNames('ninja',{start:9,end:9,prefix:'Jump__00',suffix:'.png'}),
            repeat:-1,
            frameRate:7
        })
    
        this.sprite.anims.create({
            key:'ninja-jump-attack',
            frames:this.sprite.anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Jump_Attack__00',suffix:'.png'}),
            frameRate:15
        })
    
        this.sprite.anims.create({
            key:'ninja-jump-throw',
            frames:this.sprite.anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Jump_Throw__00',suffix:'.png'}),
            frameRate:15
        })
    

    }
}