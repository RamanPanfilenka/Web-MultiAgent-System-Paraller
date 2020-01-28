export class Drawer {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.randomX = Math.random();
		this.randomY = Math.random();
		this.Init();
	}

	Init() {
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	StartDraw(ball) {
		this.ctx.lineWidth = ball.Radius;
		this.ctx.beginPath();
		this.ctx.translate(this.randomX, this.randomY );
		this.ctx.lineCap = 'round';
		this.ctx.moveTo( ball.Position.X, ball.Position.Y);
		this.ctx.lineTo( ball.Position.X, ball.Position.Y );
		this.ctx.stroke();
	}

	StepDraw(ball) {
		this.ctx.lineWidth = ball.Radius + 10;
		this.ctx.beginPath();
		this.ctx.lineCap = 'round';
		this.ctx.strokeStyle = 'black';
		this.ctx.moveTo( ball.PreviousPosition.X, ball.PreviousPosition.Y);
		this.ctx.lineTo( ball.PreviousPosition.X,ball.PreviousPosition.Y);
		this.ctx.stroke();
	}

	NewBallDraw(ball) {
		this.ctx.lineWidth = ball.Radius;
		this.ctx.beginPath();
		this.ctx.lineCap = 'round';
		this.ctx.strokeStyle = 'orange';
		this.ctx.moveTo( ball.Position.X, ball.Position.Y);
		this.ctx.lineTo( ball.Position.X,ball.Position.Y);
		this.ctx.stroke();
	}

	ReDraw(ball, ball2) {
		this.ctx.lineWidth = ball.Radius;
		this.ctx.beginPath();
		this.ctx.moveTo( ball.x, ball.y );
		this.ctx.lineTo( ball2.x, ball2.y );
		this.ctx.stroke();
	}

	StopDraw() {
		this.ctx.translate( -this.randomX, -this.randomY );
	}

	DrawFigure(figure){
		figure.DrawPotencial(this.ctx);
	}
}
