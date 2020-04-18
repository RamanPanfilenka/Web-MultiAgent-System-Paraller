export class BallDrawer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.randomX = Math.random();
        this.randomY = Math.random();
    }

    Init() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    StepDraw(ball) {
        const oldLineWidth = this.ctx.lineWidth;
        this.ctx.lineWidth = ball.Radius;
        this.ctx.beginPath();
        this.ctx.lineCap = 'round';
        this.ctx.moveTo(ball.Position.X, ball.Position.Y);
        this.ctx.lineTo(ball.Position.X, ball.Position.Y);
        this.ctx.stroke();
        this.ctx.lineWidth = oldLineWidth;
    }

    DrawFigure(figure) {
        figure.DrawPotencial(this.ctx);
    }
}