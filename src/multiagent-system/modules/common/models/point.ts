import Distance from './distance';

export default class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getDistanceTo(point: Point): Distance {
        const dx = this.x - point.x;
        const dy = this.y - point.y;

        return new Distance(dx, dy);
    }

    equals(point: Point) {
        return this.x == point.x && this.y == point.y;
    }
}