import { Shape, ShapeScheme } from './shape';
import { Point } from '../primitives/point';

export type CircleScheme = ShapeScheme

export class Circle extends Shape {
    constructor(circle: CircleScheme) {
        super(circle);
    }

    isPointIn(point: Point, deviation = 0): boolean {
        const distance = this.centerPoint.getDistanceTo(point);
        const isInside = distance.value < this.size + deviation;
        return isInside;
    }
}
