export default class Rect {
    constructor(x, y, potentialRadius) {
        this.X = x;
        this.Y = y;
        this.PotentialRadius = potentialRadius;
    }

    GetPotential(x, y, deviation = 0) {
        let pathX = Math.abs(x - this.X);
        let pathY = Math.abs(y - this.Y);
        if (pathX < this.PotentialRadius + deviation && pathY < this.PotentialRadius + deviation) {
            return true;
        }

        return false;
    }

    DrawPotential(ctx) {
        ctx.beginPath();
        ctx.rect(this.X-this.PotentialRadius, this.Y-this.PotentialRadius, 2*this.PotentialRadius,2*this.PotentialRadius);
        let old = ctx.lineWidth;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth = old;
    }
}
