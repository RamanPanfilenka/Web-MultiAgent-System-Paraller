import Shape from './shape';
import { Point } from '../point';

export default class Circle extends Shape {
    constructor(centerPoint: Point, size: number) {
        super(centerPoint, size);
    }

    isPointIn(point: Point, deviation = 0): boolean {
        const distance = this.centerPoint.getDistanceTo(point);
        const isInside = distance.value < this.size + deviation;
        return isInside;
    }
}
