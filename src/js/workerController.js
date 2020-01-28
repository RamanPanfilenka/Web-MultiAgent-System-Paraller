import { forEach } from 'async-foreach';
import { enviroment } from 'enviroment/enviroment';
import Worker from 'paraller/animationParaller.worker.js';
import { modelStatusEnum } from './modelStatusEnum';
import Circle from './model/figures/circle';
import Rect from './model/figures/rect';

export default class WorkerController {
	constructor(drawer, balls, currentFigure) {
		this.workers = [];
		this.balls = balls;
        this.drawer = drawer;
        this.figure = currentFigure;
	}

	/**
     * Check is all balls in figure
     *
     * @returns true or false
     * @memberof WorkerController
     */
    CheckAllInPotencial() {
		return this.balls.every(ball => {
			return this.figure.GetPotencial(ball.Position.X, ball.Position.Y);
		});
	}

	StopWorkers() {
        if(this.figure instanceof Circle){
            this.balls.forEach(ball => {
                ball.Speed.X = 0;
                ball.Speed.Y = 0;
                ball.Velocity = 0;
            })
            setTimeout(() => {
                this.figure = new Rect(1000, 500, 90);
            }, 2000);
            
        }else{
            this.workers.forEach(obj =>{
                obj.worker.terminate();
            });
        }
    }
    
    /**
     * Set best fuction value for new ball's position
     * 
     * @param {*} ball
     * @returns ball
     * @memberof WorkerController
     */
    SetBestValue(ball) {
		if (this.StopPointFunction(ball.Position.X, ball.Position.Y) > this.StopPointFunction(ball.BestFunctionValue.X, ball.BestFunctionValue.Y)) {
			ball.BestFunctionValue.X = ball.Position.X;
			ball.BestFunctionValue.Y = ball.Position.Y;
		}

		return ball;
    }

    /**
     * Get function value of point
     *
     * @param {*} x
     * @param {*} y
     * @returns function Value
     * @memberof WorkerController
     */
    StopPointFunction(x, y) {
		const pathX = this.figure.X - Math.abs(x - this.figure.X);
		const pathY = this.figure.Y - Math.abs(y - this.figure.Y);

		return pathY + pathX;
    }
    
    /**
     * Set new best value from nearest ball
     *
     * @param {*} bestballValue
     * @param {*} currentBall
     * @returns bestValue
     * @memberof WorkerController
     */
    CheckBestValue(bestballValue, currentBall) {
        const bestFuctionValue = this.StopPointFunction(bestballValue.X, bestballValue.Y);
        const currentBallValue = this.StopPointFunction(currentBall.BestFunctionValue.X, currentBall.BestFunctionValue.Y);
		if(bestFuctionValue < currentBallValue){
            bestballValue = currentBall.BestFunctionValue;
        } 

		return bestballValue;
    }
    
    /**
     * Change speed of ball if it is smash with another one
     *
     * @param {*} ball
     * @param {*} dx
     * @param {*} dy
     * @returns
     * @memberof WorkerController
     */
    Smash(ball, dx, dy){
        ball.Speed.X += dx * ball.Radius / 80;
        ball.Speed.Y += dy * ball.Radius / 80;
        
        return ball;
    }

	/**
     * Communicate with another ball in radius
     *
     * @param {*} currentBall
     * @returns
     * @memberof WorkerController
     */
    Communitcate(currentBall) {
        let bestFuctionValue = currentBall.BestFunctionValue;
        forEach(this.balls, (ball) => {
			const dx = currentBall.Position.X - ball.Position.X;
			const dy = currentBall.Position.Y - ball.Position.Y;
			const distance = dx*dx + dy*dy;

			if (Math.sqrt(distance) <= currentBall.ConnectRadius) {
                bestFuctionValue = this.CheckBestValue(bestFuctionValue, ball)
				if (distance  <= enviroment.SmashKoef * (ball.Radius * 2.4)) {
					currentBall =  this.Smash(currentBall, dx, dy);
				}
			}
		});
		currentBall.BestFromAll = bestFuctionValue;

		return currentBall;
    }

    Draw(currentBall){
        this.drawer.DrawFigure(this.figure);
        this.drawer.StepDraw(currentBall);
        this.drawer.NewBallDraw(currentBall);
    }

    /**
     *Common operations with balls
     *
     * @param {*} ball
     * @returns
     * @memberof WorkerController
     */
    OperationWithBall(ball){
        ball = this.SetBestValue(ball);
		ball = this.Communitcate(ball);
        const inPotencial = this.figure.GetPotencial(ball.Position.X, ball.Position.Y);
        this.balls[ball.id].inPotencial = inPotencial;
        if(inPotencial){
            ball.Speed.X /= 2;
		    ball.Speed.Y /= 2;
		    ball.Velocity /= 2;
        }
        this.balls[ball.id] = ball;

        return ball;
    }
    
    GetPostModel(ball, status){
        return {
            ball: ball,
            status: status,
            enviroment: enviroment,
        };
    }

    InitWorkers() {
		this.balls.forEach(ball => {
			
			const worker = new Worker();
            const postModel = this.GetPostModel(ball, modelStatusEnum.new);
			worker.onmessage = (msg) => {
				const model = JSON.parse(msg.data);
				this.balls[model.ball.id] = model.ball;
                const currentBall = model.ball;
				switch (model.status) {
					case modelStatusEnum.start: {
						this.drawer.StartDraw(currentBall);
						break;
					}

					case modelStatusEnum.step: {
                        this.Draw(currentBall);
                        model.ball = this.OperationWithBall(currentBall);

						if (this.CheckAllInPotencial()) {
							this.StopWorkers();
                        }
                        
                        const post = this.GetPostModel(model.ball, modelStatusEnum.old)

						worker.postMessage(JSON.stringify(post));
						break;
					}

					case modelStatusEnum.reDraw: {
						this.drawer.ReDraw(model.ball, model.additionalBall);
						break;
					}

					case modelStatusEnum.stop: {
						this.drawer.StopDraw();
						break;
					}
				}
			};

			const workerStartObject = {
				worker,
				postModel,
			};
			this.workers.push(workerStartObject);
		});
    }

	RunWorkers() {
		forEach(this.workers, obj => {
		 	obj.worker.postMessage(JSON.stringify(obj.postModel));
		});
	}
}
