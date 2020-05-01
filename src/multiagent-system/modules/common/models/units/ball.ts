import Unit from "./unit";
import Speed from "../speed";
import Point from "../point";

export default class Ball extends Unit {
    radius: number;

    constructor(
        position: Point,
        speed: Speed,
        connectionRadius: number,
        radius: number,
    ) {
        super(position, speed, connectionRadius);
        this.radius = radius;
    }

    update(ball: Ball) {
        super.update(ball);
        this.radius = ball.radius;
    }
}