import Distance from './distance';

export interface IPoint {
    x: number;
    y: number;
}

export class Point implements IPoint {
    x: number;
    y: number;

    constructor(point: IPoint) {
        this.x = point.x;
        this.y = point.y;
    }

    getDistanceTo(point: Point): Distance {
        const dx = this.x - point.x;
        const dy = this.y - point.y;        return new Distance(dx, dy);
    }

    equals(point: Point): boolean {
        return this.x == point.x && this.y == point.y;
    }
}
