import Shape from './shape';
import { Point } from '../point';

export default class Rect extends Shape {
    constructor(centerPoint: Point, size: number) {
        super(centerPoint, size);
    }

    isPointIn(point: Point, deviation = 0): boolean {
        const dx = Math.abs(this.centerPoint.x - point.x);
        const dy = Math.abs(this.centerPoint.y - point.y);
        const isInside = dx < this.size + deviation && dy < this.size + deviation;
        return isInside;
    }
}
