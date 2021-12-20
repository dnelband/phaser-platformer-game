import Phaser from "phaser";
import { sharedInstance as events } from "./EventsCenter";

export default class UI extends Phaser.Scene{

    private starsLabel!: Phaser.GameObjects.Text;
    private starsCollected = 0;
    private graphics: Phaser.GameObjects.Graphics;
    private lastHealth: number = 100;
    
    constructor(){
        super({
            key:'ui'
        })
    }
    
    init(){
        this.starsCollected = 0;
    }
    
    create(){

        // adding graphics object
        this.graphics = this.add.graphics()
        this.setHealthBar(100)

        this.starsLabel = this.add.text(10,25,'Stars: ' + this.starsCollected,{
            fontSize: '16px'
        })


        events.on('health-changed', this.handleHealthChanged, this)
        events.on('star-collected', this.handleCollectedStar, this)
    }

    private setHealthBar(value:number){

        const width = 200;
        const percent = Phaser.Math.Clamp(value,0,100) / 100;

        this.graphics.clear();
        // first thing that is drawn will be gray
        this.graphics.fillStyle(0x808080)
        // the background of the hp bar
        this.graphics.fillRoundedRect(10,10,width,10,2)

        if (percent > 0){
            // next thing that is drawn will be green
            this.graphics.fillStyle(0x00ff00)
            // the filling of the hp bar
            this.graphics.fillRoundedRect(10,10,width * percent,10,2)
        }
    }

    private handleHealthChanged(value:number){
        
        this.tweens.addCounter({
            from:this.lastHealth,
            to:value,
            duration:200,
            onUpdate: tween => {
                const value = tween.getValue();
                console.log(value);
                this.setHealthBar(value);
            }
        })
        
        this.lastHealth = value;
    }

    private handleCollectedStar(){
        console.log(this.starsLabel);
        console.log('UI: star collected');
        ++this.starsCollected;
        this.starsLabel.text = `Stars: ${this.starsCollected}`
    }
}