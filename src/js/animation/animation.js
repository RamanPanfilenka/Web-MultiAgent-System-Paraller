import { modelStatusEnum } from "../modelStatusEnum";

export default class BallAnimation {
	constructor(ball, enviroment) {
		this.ball = ball;
		this.enviroment = enviroment;
	}

	Anim() {
		let postModel = {status: modelStatusEnum.start,ball: this.ball, additionalBall: null};
		postMessage(JSON.stringify(postModel));
		setInterval(() => {
			this.ball = this.Step(this.ball);
			postModel.status = modelStatusEnum.step;
			postModel.ball = this.ball;
			postMessage(JSON.stringify(postModel));
		}, 50);
	}

	Step(ball) {
		ball.PreviousPosition.X = ball.Position.X;
		ball.PreviousPosition.Y = ball.Position.Y;
		ball.Position.X += ball.Speed.X;
		ball.Position.Y += ball.Speed.Y;


		if (ball.Velocity > ball.Radius / 2) {

			ball.Velocity -= .5;
			ball.Speed.X = Math.cos(ball.Angle) * ball.Velocity;
			ball.Speed.Y = Math.sin(ball.Angle) * ball.Velocity;
		}

		if (ball.Position.X < 0) {

			ball.Position.X = 0;
			ball.Speed.X *= -1;
			ball = this.ChangeAngle(ball);

		} else if ( ball.Position.X > this.enviroment.width - 20 ) {

			ball.Position.X = this.enviroment.width - 20;
			ball.Speed.X *= -1;
			ball = this.ChangeAngle(ball);
		}

		if (ball.Position.Y < 0 ) {

			ball.Position.Y = 0;
			ball.Speed.Y *= -1;
			ball = this.ChangeAngle(ball);
		} else if (ball.Position.Y> this.enviroment.height - 20) {

			ball.Position.Y = this.enviroment.height - 20;
			ball.Speed.Y *= -1;
			ball = this.ChangeAngle(ball);
		}

		return ball;
	}

	ChangeAngle(ball) {
		ball.Angle = Math.atan(ball.Speed.Y / ball.Speed.X );

		if ( ball.Speed.X < 0 )
			ball.Angle += Math.PI;
		if ( ball.Speed.X !== 0 )
			ball.Velocity = ball.Speed.X / Math.cos( ball.Angle );
		else
			ball.Velocity = ball.Speed.Y / Math.sin( ball.Angle );

		return ball;
	}
}
