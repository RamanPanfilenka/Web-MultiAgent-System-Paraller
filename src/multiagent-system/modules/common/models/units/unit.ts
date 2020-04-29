import Point from "../point";
import Speed from "../speed";

export default class Unit {
    position: Point;
    speed: Speed;
    connectionRadius: number;

    constructor(
        position: Point,
        speed: Speed,
        connectionRadius: number,
    ) {
        this.position = position;
        this.speed = speed;
        this.connectionRadius = connectionRadius;
    }

    update(unit: Unit) {
        this.position = unit.position;
        this.speed = unit.speed;
        this.connectionRadius = unit.connectionRadius;
    }
}