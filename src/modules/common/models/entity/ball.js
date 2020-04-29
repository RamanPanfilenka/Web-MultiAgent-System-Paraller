import Entity from "./entity";

export default class Ball extends Entity{
    constructor(position, speed, connectionRadius, radius){
        super(position, speed, connectionRadius);
        this.radius = radius;
    }

    update(ball){
        super.update(ball);
        this.radius = ball.radius;
    }
}