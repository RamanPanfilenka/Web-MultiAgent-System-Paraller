export default class AlgotithmAnimation {
	constructor(ball, stopX, stopY, currentFigure, enviroment, ballanimation) {
		this.ball = ball;
		this.StopX = stopX;
		this.StopY = stopY;
		this.CurrentFigure = currentFigure;
		this.destation = enviroment.destation;
		this.ballanimation = ballanimation;
	}

	Anim() {
		let postModel = {status: 'start',ball: this.ball, additionalBall: null, isPotencial: false};
		postMessage(JSON.stringify(postModel));
		setInterval(() => {
			this.ball = this.ballanimation.Step(this.ball);
			this.ball = this.ballanimation.Smash(this.ball);
			this.ball = this.BestFromAllInRadius(this.ball);
			this.ball = this.SetBestValue(this.ball);
			this.ball = this.CorrectSpeed(this.ball);
			this.ball = this.ballanimation.Smash(this.ball);
			let inPotencial = this.CurrentFigure.GetPotencial(this.ball.Position.X, this.ball.Position.Y);
			if (inPotencial) {
				this.ball.Speed.X /= 10;
				this.ball.Speed.Y /= 10;
				this.ball.Velocity /= 10;
				this.ball.Speed.X = 0;
				this.ball.Speed.Y = 0;
				this.ball.Velocity = 0;
				this.ball.Angle = 0;
			}

			this.ball = this.ballanimation.Smash(this.ball);
			postModel.status = 'step';
			postModel.ball = this.ball;
			postModel.isPotencial = inPotencial;
			postMessage(JSON.stringify(postModel));
		}, 50);
	}

	OurFunction(x, y) {
		let pathX = this.CurrentFigure.X - Math.abs(x - this.CurrentFigure.X);
		let pathY = this.CurrentFigure.Y - Math.abs(y - this.CurrentFigure.Y);

		return pathY + pathX;
	}
	CorrectSpeed(ball) {
		if (ball.BestFromAll != undefined) {
			ball.Speed.X = ball.Speed.X * 0.03
                            + 0.2 * Math.random() * (ball.BestFunctionValue.X - ball.Position.X)
                            + 0.5 * Math.random() * (ball.BestFromAll.X - ball.Position.X);
			ball.Speed.Y = ball.Speed.Y * 0.03
                            + 0.2 * Math.random() * (ball.BestFunctionValue.Y - ball.Position.Y)
                            + 0.5 * Math.random() * (ball.BestFromAll.Y - ball.Position.Y);
		} else {
			ball.Speed.X = ball.Speed.X * 0.3
                            + Math.random() * (ball.BestFunctionValue.X - ball.Position.X);
			ball.Speed.Y = ball.Speed.Y * 0.3
                            + Math.random() * (ball.BestFunctionValue.Y - ball.Position.Y);
		}
		ball.Speed.X /= 10;
		ball.Speed.Y /= 10;

		return ball;
	}

	BestFromAllInRadius(currentBall) {
		let bestValue = currentBall.BestFunctionValue;
		this.ballanimation.ballsInRadius.forEach(ball => {
			if (this.StopPointFunction(ball.BestFunctionValue.X, ball.BestFunctionValue.Y) > this.StopPointFunction(currentBall.BestFunctionValue.X, currentBall.BestFunctionValue.Y)) {
				bestValue = ball.BestFunctionValue;
			}
		});
		currentBall.BestFromAll = bestValue;

		return currentBall;
	}

	SetBestValue(ball) {
		if (this.StopPointFunction(ball.Position.X, ball.Position.Y) > this.StopPointFunction(ball.BestFunctionValue.X, ball.BestFunctionValue.Y)) {
			ball.BestFunctionValue.X = ball.Position.X;
			ball.BestFunctionValue.Y = ball.Position.Y;
		}

		return ball;
	}

	StopPointFunction(x, y) {
		let pathX = this.CurrentFigure.X - Math.abs(x - this.CurrentFigure.X);
		let pathY = this.CurrentFigure.Y - Math.abs(y - this.CurrentFigure.Y);

		return pathY + pathX;
	}
}




