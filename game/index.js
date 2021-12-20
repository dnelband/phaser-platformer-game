import Phaser from "phaser";
import Preloader from "./scenes/Preloader";
import UI from "./scenes/UI";
import Game from './scenes/Game.ts';


var config = {
    type: Phaser.AUTO,
    width: 550,
    height: 300,
    physics: {
        default: 'matter',
        matter:{
            debug:true
        }
    },
    scale:{
        zoom:3
    },
    scene: [Preloader,Game, UI]
};

var game = new Phaser.Game(config);
