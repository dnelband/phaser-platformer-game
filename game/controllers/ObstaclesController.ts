const createkey = (name: string, id: number) => {
    return `${name}-${id}`
}

export default class ObstaclesController
{
    private obstacles = new Map<string, MatterJS.BodyType>()

    add(name: string, body: MatterJS.BodyType){
        const key = createkey(name,body.id)
        if (this.obstacles.has(key)){
            throw new Error('obstacles already exists at this key')
        }
        this.obstacles.set(key,body)
    }

    is(name: string, body: MatterJS.BodyType){
        const key = createkey(name,body.id)
        if (this.obstacles.has(key)){
            console.log('this obstacles has this key ' + key)
            return true
        }
        return false
    }
}