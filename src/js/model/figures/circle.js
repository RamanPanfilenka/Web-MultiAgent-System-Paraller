export default class Circle {
    constructor(x, y, potencialRadius) {
        this.X = x;
        this.Y = y;
        this.PotencialRadius = potencialRadius;
    }

    GetPotencial(x, y, deviation = 0) {
        let inPotencial = false;
        let pathX = Math.abs(x - this.X);
        let pathY = Math.abs(y - this.Y);
        if (Math.sqrt(pathX ** 2 + pathY ** 2) < this.PotencialRadius + deviation) {
            inPotencial = true;
        }

        return inPotencial;
    }

    DrawPotencial(ctx) {
        ctx.beginPath();
        ctx.arc(this.X, this.Y, this.PotencialRadius, 0, Math.PI*2, false);
        let old = ctx.lineWidth;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth = old;
    }
}
