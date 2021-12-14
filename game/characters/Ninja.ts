import Phaser from "phaser";

declare global
{
	namespace Phaser.GameObjects
	{
		interface GameObjectFactory
		{
			ninja(x: number, y: number, texture: string, frame?: string | number): Ninja
		}
	}
}

enum HealthState {
    IDLE,
    DAMAGE,
    DEAD
}

export default class Ninja extends Phaser.Physics.Matter.Sprite{

    private healthState = HealthState.IDLE
    private damageTime = 0
    private _health = 3

    get health(){
        return this._health
    }

    constructor(scene: any,x:number,y:number,texture:string,frame?: string | number,options?:Phaser.Types.Physics.Matter.MatterBodyConfig){
        super(scene.matter.world,x,y,texture,frame,options)
    }

    preUpdate(t:number,dt:number){
		super.preUpdate(t, dt)

		switch (this.healthState)
		{
			case HealthState.IDLE:
				break

			case HealthState.DAMAGE:
				this.damageTime += dt
				if (this.damageTime >= 250)
				{
					this.healthState = HealthState.IDLE
					this.setTint(0xffffff)
					this.damageTime = 0
				}
				break
             
		}
    }

    update(cursors:Phaser.Types.Input.Keyboard.CursorKeys){

    }

    takeDamage(){
        console.log('take damage')
    }
}

Phaser.GameObjects.GameObjectFactory.register('ninja',function(this:Phaser.GameObjects.GameObjectFactory,x:number,y:number, texture: string, frame?: string | number){
    var sprite = new Ninja(this.scene,x,y,texture,frame);
    this.displayList.add(sprite);
    this.updateList.add(sprite);
    return sprite;
})