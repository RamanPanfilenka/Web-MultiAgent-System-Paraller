import { Distance } from './distance';

export interface PointScheme {
    x: number;
    y: number;
}

export class Point {
    x: number;
    y: number;

    constructor(point: PointScheme) {
        this.x = point.x;
        this.y = point.y;
    }

    getDistanceTo(point: Point): Distance {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        return new Distance(dx, dy);
    }

    equals(point: Point): boolean {
        return this.x == point.x && this.y == point.y;
    }
}
