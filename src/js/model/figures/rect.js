export default class Rect {
    constructor(x, y, potentialRadius) {
        this.x = x;
        this.y = y;
        this.potentialRadius = potentialRadius;
    }

    getPotential(x, y, deviation = 0) {
        const pathX = Math.abs(x - this.x);
        const pathY = Math.abs(y - this.y);
        if (pathX < this.potentialRadius + deviation && pathY < this.potentialRadius + deviation) {
            return true;
        }

        return false;
    }

    drawPotential(context) {
        context.beginPath();
        context.rect(
            this.x - this.potentialRadius,
            this.y - this.potentialRadius,
            2*this.potentialRadius,
            2*this.potentialRadius,
        );
        const oldLineWidth = context.lineWidth;
        context.lineWidth = 2;
        context.stroke();
        context.lineWidth = oldLineWidth;
    }
}
