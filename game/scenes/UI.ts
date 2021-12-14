import Phaser from "phaser";

export default class UI extends Phaser.Scene{
    constructor(){
        super({
            key:'ui'
        })
    }
    create(){
        this.add.text(10,10,'Stars: 0',{
            fontSize: '32px'
        })
    }
}