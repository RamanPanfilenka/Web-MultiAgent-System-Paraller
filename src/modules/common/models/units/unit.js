export default class Unit{
    constructor(position, speed, connectionRadius){
        this.position = position;
        this.speed = speed;
        this.connectionRadius = connectionRadius;
    }

    update(entity){
        this.position = entity.position;
        this.speed = entity.speed;
        this.connectionRadius = entity.connectionRadius;
    }
}