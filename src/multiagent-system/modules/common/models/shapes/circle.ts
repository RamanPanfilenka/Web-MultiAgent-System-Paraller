import { Shape, IShape } from './shape';
import { Point } from '../primitives/point';

export type ICircle = IShape

export class Circle extends Shape implements ICircle {
    constructor(circle: ICircle) {
        super(circle);
    }

    isPointIn(point: Point, deviation = 0): boolean {
        const distance = this.centerPoint.getDistanceTo(point);
        const isInside = distance.value < this.size + deviation;
        return isInside;
    }
}
