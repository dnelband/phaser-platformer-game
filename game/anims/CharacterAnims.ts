import Phaser from "phaser";

const createCharacterAnims = (anims:Phaser.Animations.AnimationManager) => {

    anims.create({
        key:'ninja-idle',
        frames:anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Idle__00',suffix:'.png'}),
        repeat:-1,
        frameRate:15
    })

    anims.create({
        key:'ninja-run',
        frames:anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Run__00',suffix:'.png'}),
        repeat:-1,
        frameRate:25
    })

    anims.create({
        key:'ninja-attack',
        frames:anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Attack__00',suffix:'.png'}),
        frameRate:15
    })

    anims.create({
        key:'ninja-throw',
        frames:anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Throw__00',suffix:'.png'}),
        frameRate:15
    })

    anims.create({
        key:'ninja-slide',
        frames:anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Slide__00',suffix:'.png'}),
        repeat:-1,
        frameRate:15
    })

    anims.create({
        key:'ninja-dead',
        frames:anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Dead__00',suffix:'.png'}),
        frameRate:15
    })

    anims.create({
        key:'ninja-jump',
        frames:anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Jump__00',suffix:'.png'}),
        frameRate:7
    })

    anims.create({
        key:'ninja-jump-idle',
        frames:anims.generateFrameNames('ninja',{start:9,end:9,prefix:'Jump__00',suffix:'.png'}),
        repeat:-1,
        frameRate:7
    })

    anims.create({
        key:'ninja-jump-attack',
        frames:anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Jump_Attack__00',suffix:'.png'}),
        frameRate:15
    })

    anims.create({
        key:'ninja-jump-throw',
        frames:anims.generateFrameNames('ninja',{start:0,end:9,prefix:'Jump_Throw__00',suffix:'.png'}),
        frameRate:15
    })

}

export {
    createCharacterAnims
}