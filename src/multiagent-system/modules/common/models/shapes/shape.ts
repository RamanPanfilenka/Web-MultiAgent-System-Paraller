import { Point, PointScheme } from '../primitives/point';

export interface ShapeScheme {
    centerPoint: PointScheme;
    size: number;
}

export abstract class Shape {
    centerPoint: Point;
    size: number;

    constructor(shape: ShapeScheme) {
        this.centerPoint = new Point(shape.centerPoint);
        this.size = shape.size;
    }

    abstract isPointIn(point: Point, deviation: number): boolean;
}
