import { parallerForEach } from 'async-foreach';
import { enviroment } from '../enviroment/enviroment';


export default class WorkerController {
	constructor(drawer, balls) {
		this.workers = [];
		this.balls = balls;
		this.drawer = drawer;
		this.modelStatus = Object.freeze({new: 'new', start: 'start', step: 'step', reDraw: 'reDraw', stop: 'stop', old: 'old'});
	}

	CheckAllInPotencial() {
		return this.balls.every(ball => {
			return ball.inPotencial;
		});
	}

	StopWorkers() {
		this.workers.forEach(obj =>{
			obj.worker.terminate();
		});
	}

	GetNearestBalls(currentBall) {
		const neearsBalls = [];
		const ballsInRadius = [];
		parallerForEach(this.balls, (ball) => {
			const dx = currentBall.Position.X - ball.Position.X;
			const dy = currentBall.Position.Y - ball.Position.Y;
			const distance = dx*dx + dy*dy;

			if (Math.sqrt(distance) <= currentBall.ConnectRadius) {
				ballsInRadius.push(ball);
				if (distance <= enviroment.SmashKoef * (ball.Radius * 2)) {
					const ballInfo = {ball: ball, dx: dx, dy: dy};
					neearsBalls.push(ballInfo);
				}
			}
		});

		const responseObject = {nearsBalls: neearsBalls, ballsInRadius: ballsInRadius};

		return responseObject;
	}

	InitWorkers() {
		this.balls.forEach(ball => {
			const postModel = {
				ball: ball,
				enviroment: enviroment,
				nearest: [],
				ballsInRadisu: [],
				status: this.modelStatus.new,
			};
			const worker = new Worker('worker.js');

			worker.onmessage = (msg) => {
				const model = JSON.parse(msg.data);
				this.balls[model.ball.id] = model.ball;

				switch (model.status) {
					case this.modelStatus.start: {
						this.drawer.StartDraw(ball);
						break;
					}

					case this.modelStatus.step: {
						this.drawer.StepDraw(model.ball);
						this.drawer.NewBallDraw(model.ball);
						let ballsModel = this.GetNearestBalls(model.ball);

						const post = {
							status: this.modelStatus.old,
							nearsBalls: ballsModel.nearsBalls,
							ballsInRadius: ballsModel.ballsInRadius,
							ball: model.ball,
						};
						this.balls[model.ball.id].inPotencial = model.isPotencial;

						if (this.CheckAllInPotencial()) {
							this.StopWorkers();
						}

						worker.postMessage(JSON.stringify(post));
						break;
					}

					case this.modelStatus.reDraw: {
						this.drawer.ReDraw(model.ball, model.additionalBall);
						break;
					}

					case this.modelStatus.Stop: {
						this.drawer.StopDraw();
						break;
					}
				}
			};

			const workerStartObject = {worker: worker, postModel: postModel};
			this.workers.push(workerStartObject);
		});
	}

	RunWorkers() {
		parallerForEach(this.workers, obj => {
			obj.worker.postMessage(JSON.stringify(obj.postModel));
		});
	}
}
