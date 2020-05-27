import { Shape, ShapeScheme } from './shape';
import { Point } from '../primitives/point';

export type SquareScheme = ShapeScheme

export class Square extends Shape {
    constructor(square: SquareScheme) {
        super(square);
    }

    isPointIn(point: Point, deviation = 0): boolean {
        const dx = Math.abs(this.centerPoint.x - point.x);
        const dy = Math.abs(this.centerPoint.y - point.y);
        const isInside = dx < this.size + deviation && dy < this.size + deviation;
        return isInside;
    }
}
