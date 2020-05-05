import { Shape, IShape } from './shape';
import { Point } from '../primitives/point';

export type ISquare = IShape

export class Square extends Shape implements ISquare {
    constructor(square: ISquare) {
        super(square);
    }

    isPointIn(point: Point, deviation = 0): boolean {
        const dx = Math.abs(this.centerPoint.x - point.x);
        const dy = Math.abs(this.centerPoint.y - point.y);
        const isInside = dx < this.size + deviation && dy < this.size + deviation;
        return isInside;
    }
}
