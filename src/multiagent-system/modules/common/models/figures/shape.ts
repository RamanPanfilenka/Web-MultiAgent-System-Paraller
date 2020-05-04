import { Point } from '../point';

export default class Shape {
    centerPoint: Point;
    size: number;

    constructor(centerPoint: Point, size: number) {
        this.centerPoint = centerPoint;
        this.size = size;
    }
}
