import { forEach } from 'async-foreach';
import { enviroment } from '@/enviroment/enviroment';
import ActionList from '../model/actionList';
import Circle from '../model/figures/circle';
import Rect from '../model/figures/rect';
import {actionEnum} from '../helpers/actionListEnum';

export class shapeFillingService {

    constructor(balls, drawer, figure) {
        this.balls = balls;
        this.drawer = drawer;
        this.figure = figure;
        this.postCount = 0;
        this.nearestBalls = [];
        this.workerPostModels = [];
        this.actionList = new ActionList();
        this.smashCoeff = enviroment.SmashKoef;
    }

    /**
     * Check is all balls in figure
     *
     * @returns true or false
     * @memberof WorkerController
     */
    CheckAllInPotencial() {
        return this.balls.every(ball => {
            return this.figure.GetPotencial(ball.Position.X, ball.Position.Y) && this.nearestBalls.length == 0;
        });
    }

    StopWorkers() {
        if (this.figure instanceof Rect) {
            setTimeout(() => {
                this.figure = new Circle(1000, 500, 95);
                this.smashCoeff = enviroment.SmashKoef;
            }, 1000);
            this.balls.forEach(ball => {
                ball.Speed.X = 0;
                ball.Speed.Y = 0;
                ball.Velocity = 0;
            });

        } else {
            this.balls.forEach(ball => {
                ball.worker.terminate();
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
        if (bestFuctionValue < currentBallValue) {
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
    Smash(ball, ball2, dx, dy) {
        ball.Speed.X += dx * ball.Radius / 80;
        ball.Speed.Y += dy * ball.Radius / 80;
        ball2.Speed.X -= dx * ball.Radius / 80;
        ball2.Speed.Y -= dy * ball.Radius / 80;

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
            const distance = dx * dx + dy * dy;

            if (Math.sqrt(distance) <= currentBall.ConnectRadius) {
                bestFuctionValue = this.CheckBestValue(bestFuctionValue, ball);
                if (distance <= this.smashCoeff* (ball.Radius * 2)) {
                    this.nearestBalls.push(ball);
                    currentBall = this.Smash(currentBall, ball, dx, dy);
                }
            }
        });
        currentBall.BestFromAll = bestFuctionValue;

        return currentBall;
    }

    Draw(ball) {
        this.drawer.DrawFigure(this.figure);
        this.drawer.StepDraw(ball);
    }

    /**
     *Common operations with balls
     *
     * @param {*} ball
     * @returns
     * @memberof WorkerController
     */
    OperationWithBall(ball) {
        ball = this.SetBestValue(ball);
        ball = this.Communitcate(ball);
        const inPotencial = this.figure.GetPotencial(ball.Position.X, ball.Position.Y);
        this.balls[ball.id].inPotencial = inPotencial;
        if (inPotencial) {
            ball.Speed.X /= 2;
            ball.Speed.Y /= 2;
            ball.Velocity /= 2;
        }
        this.balls[ball.id] = ball;

        return ball;
    }

    DecreaseSmash() {
        if (this.balls.every(ball => this.figure.GetPotencial(ball.Position.X, ball.Position.Y, 20))) {
            this.smashCoeff -= 0.1;
        }
    }

    WorkerAnsverSubscription(worker) {
        worker.onmessage = (msg) => {
            this.postCount++;
            const model = JSON.parse(msg.data);
            this.balls[model.ball.id] = model.ball;
            this.balls[model.ball.id].worker = worker;
            if (this.postCount == this.balls.length) {
                this.postCount = 0;
                this.drawer.Init();
                this.balls.forEach((ball) => {
                    if (this.CheckAllInPotencial()) {
                        ball.Speed.X = 0;
                        ball.Speed.Y = 0;
                        ball.Velocity = 0;
                    }
                    ball = this.GetAction(ball);
                    ball = this.OperationWithBall(ball);
                    ball.nearestBalls = this.nearestBalls;
                    this.nearestBalls = [];
                });
                this.balls.forEach(ball => {
                    this.Draw(ball);
                });
                this.DecreaseSmash();
                if (this.CheckAllInPotencial()) {
                    this.StopWorkers();
                }

                this.SendDataToWorkers();
            }
        };
    }

    SendDataToWorkers() {
        this.balls.forEach((ball) => {
            const postModel = {
                ball: ball,
            };
            const worker = ball.worker;
            delete ball.nearestBalls;
            delete ball.worker;
            worker.postMessage(JSON.stringify(postModel));
        });
    }


    GetAction(ball) {
        switch (ball.currentAction) {
            case actionEnum.moveToPotencialBase:
                ball = this.actionList.MoveToPotencialBase(ball);
                break;
        }

        return ball;
    }


    GetPostModel(ball) {
        return {
            ball: ball,
            enviroment: enviroment,
        };
    }

}