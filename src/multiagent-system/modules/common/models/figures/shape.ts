import { Point } from '../point';

export default abstract class Shape {
    centerPoint: Point;
    size: number;

    constructor(centerPoint: Point, size: number) {
        this.centerPoint = centerPoint;
        this.size = size;
    }

    abstract isPointIn(point: Point, deviation: number): boolean;
}
