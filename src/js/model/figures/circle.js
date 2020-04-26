export default class Circle {
    constructor(x, y, potentialRadius) {
        this.x = x;
        this.y = y;
        this.potentialRadius = potentialRadius;
    }

    getPotential(x, y, deviation = 0) {
        let inPotential = false;
        let pathX = Math.abs(x - this.x);
        let pathY = Math.abs(y - this.y);
        if (Math.sqrt(pathX ** 2 + pathY ** 2) < this.potentialRadius + deviation) {
            inPotential = true;
        }

        return inPotential;
    }

    drawPotential(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.potentialRadius, 0, Math.PI*2, false);
        const oldLineWidth = context.lineWidth;
        context.lineWidth = 2;
        context.stroke();
        context.lineWidth = oldLineWidth;
    }
}
