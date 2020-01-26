import $ from 'jquery';
import forEach from 'async-foreach';
import Ball from 'js/model/ball';
import { enviroment } from 'enviroment/enviroment';
import { Drawer } from 'paraller/drawer';
import animationParaller from 'paraller/animationParaller';


const balls = [...new Array(60)].map((a, index) => new Ball(20, index));
const workers = [];

function getNearestBalls(currentBall) {
	const ballsInRadius = [];
	const nearestBalls = [];

	forEach(balls, (ball) => {
		const gap = {
			dx: currentBall.Position.X - ball.Position.X,
			dy: currentBall.Position.Y - ball.Position.Y,
		};
		const distance = (gap.dx ** 2) + (gap.dy ** 2);

		if (Math.sqrt(distance) <= currentBall.ConnectRadius) {
			ballsInRadius.push(ball);

			if (distance <= enviroment.SmashKoef * (ball.Radius * 2)) {
				const ballInfo = { ball, ...gap };
				nearestBalls.push(ballInfo);
			}
		}
	});

	const responseObject = {
		nearestBalls,
		ballsInRadius,
	};

	return responseObject;
}

function checkAllInPotencial() {
	return balls.every(ball => ball.inPotencial);
}

function stopWorkers() {
	workers.forEach(obj => {
		obj.worker.terminate();
	});
}


function mainAnim() {
	const drawer = new Drawer($('#c'));

	balls.forEach(ball => {
		const blob = new Blob(
			[`(${animationParaller.toString()})()`],
			{
				type: 'text/javascript',
			}
		);
		const url = window.URL || window.webkitURL;
		const blobUrl = url.createObjectURL(blob);
		const worker = new Worker(blobUrl);

		worker.onmessage = message => {
			const model = JSON.parse(message.data);
			balls[model.ball.id] = model.ball;

			switch (model.status) {
				case 'start': {
					drawer.StartDraw(ball);
					break;
				}

				case 'step': {
					drawer.StepDraw(model.ball);
					drawer.NewBallDraw(model.ball);
					const ballsModel = getNearestBalls(model.ball);
					const postModel = {
						status: 'old',
						nearestBalls: ballsModel.nearestBalls,
						ballsInRadius: ballsModel.ballsInRadius,
						ball: model.ball,
					};
					balls[model.ball.id].inPotencial = model.isPotencial;
					if (checkAllInPotencial()) {
						stopWorkers();
					}
					worker.postMessage(JSON.stringify(postModel));
					break;
				}

				case 'reDraw': {
					drawer.ReDraw(model.ball, model.additionalBall);
					break;
				}

				case 'stop': {
					drawer.StopDraw();
					break;
				}
			}
		};

		const postModel = {
			status: 'new',
			nearestBalls: [],
			ballsInRadius: [],
			enviroment,
			ball,
		};
		const saveObject = {
			worker,
			postModel,
		};
		workers.push(saveObject);
	});

	forEach(workers, (obj) => {
		obj.worker.postMessage(JSON.stringify(obj.postModel));
	});
}

window.onload = () => {
	$('#c').css({
		'width': window.innerWidth,
		'height': window.innerHeight,
	});
	mainAnim();
};

