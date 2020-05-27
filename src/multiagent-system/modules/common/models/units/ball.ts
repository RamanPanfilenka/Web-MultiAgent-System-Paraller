import { Unit, UnitScheme } from './unit';

export interface BallScheme extends UnitScheme {
    radius: number;
}

export class Ball extends Unit {
    radius: number;

    constructor(ball: BallScheme) {
        super(ball);
        this.radius = ball.radius;
    }
}
