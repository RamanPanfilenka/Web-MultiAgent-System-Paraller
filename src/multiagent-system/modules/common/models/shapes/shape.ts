import { Point, IPoint } from '../primitives/point';

export interface IShape {
    centerPoint: IPoint;
    size: number;
}

export abstract class Shape implements IShape {
    centerPoint: Point;
    size: number;

    constructor(shape: IShape) {
        this.centerPoint = new Point(shape.centerPoint);
        this.size = shape.size;
    }

    abstract isPointIn(point: Point, deviation: number): boolean;
}
