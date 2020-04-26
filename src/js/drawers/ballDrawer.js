export class BallDrawer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.randomX = Math.random();
        this.randomY = Math.random();
    }

    init() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    stepDraw(ball) {
        const oldLineWidth = this.context.lineWidth;
        this.context.lineWidth = ball.radius;
        this.context.beginPath();
        this.context.lineCap = 'round';
        this.context.moveTo(ball.position.x, ball.position.y);
        this.context.lineTo(ball.position.x, ball.position.y);
        this.context.stroke();
        this.context.lineWidth = oldLineWidth;
    }

    drawFigure(figure) {
        figure.drawPotential(this.context);
    }
}