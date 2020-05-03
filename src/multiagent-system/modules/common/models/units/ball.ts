import  {Unit, IUnit } from './unit';

export interface IBall extends IUnit {
    radius: number;
}

export class Ball extends Unit implements IBall {
    radius: number;

    constructor(ball: IBall) {
        super(ball);
        this.radius = ball.radius;
    }
}