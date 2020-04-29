import Point from '../point';
import Speed from '../speed';

export default class Unit {
    position: Point;
    speed: Speed;
    connectionRange: number;

    constructor(
        position: Point,
        speed: Speed,
        connectionRadius: number,
    ) {
        this.position = position;
        this.speed = speed;
        this.connectionRange = connectionRadius;
    }

    update(unit: Unit) {
        this.position = unit.position;
        this.speed = unit.speed;
        this.connectionRange = unit.connectionRange;
    }

    isInRange(unit: Unit): boolean {
        const distance = this.position.getDistanceTo(unit.position);

        return (distance.value <= this.connectionRange);
    }
}