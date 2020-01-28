import BallAnimation from "./animation";
import { modelStatusEnum } from "../modelStatusEnum";

export default class AlgotithmAnimation extends BallAnimation {
	constructor(ball, enviroment) {
        super(ball, enviroment)
		this.destation = enviroment.destation;
	}

	Anim() {
		let postModel = {status:  modelStatusEnum.start ,ball: this.ball, additionalBall: null, isPotencial: false};
		postMessage(JSON.stringify(postModel));
		setInterval(() => {
			this.ball = this.Step(this.ball);
			this.ball = this.CorrectSpeed(this.ball);
			postModel.status = modelStatusEnum.step;
			postModel.ball = this.ball;
			postMessage(JSON.stringify(postModel));
		}, 50);
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
}




