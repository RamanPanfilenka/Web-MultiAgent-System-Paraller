export default class Circle {
    constructor(x, y, potentialRadius) {
        this.X = x;
        this.Y = y;
        this.PotentialRadius = potentialRadius;
    }

    GetPotential(x, y, deviation = 0) {
        let inPotential = false;
        let pathX = Math.abs(x - this.X);
        let pathY = Math.abs(y - this.Y);
        if (Math.sqrt(pathX ** 2 + pathY ** 2) < this.PotentialRadius + deviation) {
            inPotential = true;
        }

        return inPotential;
    }

    DrawPotential(ctx) {
        ctx.beginPath();
        ctx.arc(this.X, this.Y, this.PotentialRadius, 0, Math.PI*2, false);
        let old = ctx.lineWidth;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth = old;
    }
}
