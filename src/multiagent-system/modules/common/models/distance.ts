export class Distance {
    dx: number;
    dy: number;

    constructor(dx: number, dy: number) {
        this.dx = dx;
        this.dy = dy;
    }

    get value(): number {
        return Math.sqrt(this.dx ** 2 + this.dy ** 2);
    }
}
