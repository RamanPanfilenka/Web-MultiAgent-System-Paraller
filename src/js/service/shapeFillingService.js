import { forEach } from 'async-foreach';
import config  from '@/config';
import ActionList from '../model/actionList';
import Circle from '../model/figures/circle';
import Rect from '../model/figures/rect';
import { actionEnum } from '../enums/actionListEnum';

export class ShapeFillingService {
    constructor(balls, drawer, figure) {
        this.balls = balls;
        this.drawer = drawer;
        this.figure = figure;
        this.postCount = 0;
        this.nearestBalls = [];
        this.workerPostModels = [];
        this.actionList = new ActionList();
        this.smashCoefficient = config.smashCoefficient;
    }

    checkAllInPotential() {
        return this.balls.every(ball => {
            return this.figure.getPotential(ball.position.x, ball.position.y) && this.nearestBalls.length == 0;
        });
    }

    stopWorkers() {
        if (this.figure instanceof Rect) {
            setTimeout(() => {
                this.figure = new Circle(1000, 500, 95);
                this.smashCoefficient = config.smashCoefficient;
            }, 1000);
            this.balls.forEach(ball => {
                ball.speed.x = 0;
                ball.speed.y = 0;
                ball.velocity = 0;
            });

        } else {
            this.balls.forEach(ball => {
                ball.worker.terminate();
            });
        }
    }

    setBestValue(ball) {
        if (this.stopPointFunction(ball.position.x, ball.position.y) > this.stopPointFunction(ball.bestFunctionValue.x, ball.bestFunctionValue.y)) {
            ball.bestFunctionValue.x = ball.position.x;
            ball.bestFunctionValue.y = ball.position.y;
        }

        return ball;
    }

    stopPointFunction(x, y) {
        const pathX = this.figure.x - Math.abs(x - this.figure.x);
        const pathY = this.figure.y - Math.abs(y - this.figure.y);

        return pathY + pathX;
    }

    checkBestValue(bestBallValue, currentBall) {
        const bestFunctionValue = this.stopPointFunction(bestBallValue.x, bestBallValue.y);
        const currentBallValue = this.stopPointFunction(currentBall.bestFunctionValue.x, currentBall.bestFunctionValue.y);
        if (bestFunctionValue < currentBallValue) {
            bestBallValue = currentBall.bestFunctionValue;
        }

        return bestBallValue;
    }

    smash(ball, ball2, dx, dy) {
        ball.speed.x += dx * ball.radius / 80;
        ball.speed.y += dy * ball.radius / 80;
        ball2.speed.x -= dx * ball.radius / 80;
        ball2.speed.y -= dy * ball.radius / 80;

        return ball;
    }

    communicate(currentBall) {
        let bustFunctionValue = currentBall.bestFunctionValue;
        forEach(this.balls, (ball) => {
            const dx = currentBall.position.x - ball.position.x;
            const dy = currentBall.position.y - ball.position.y;
            const distance = dx * dx + dy * dy;

            if (Math.sqrt(distance) <= currentBall.connectRadius) {
                bustFunctionValue = this.checkBestValue(bustFunctionValue, ball);
                if (distance <= this.smashCoefficient* (ball.radius * 2)) {
                    this.nearestBalls.push(ball);
                    currentBall = this.smash(currentBall, ball, dx, dy);
                }
            }
        });
        currentBall.bestFromAll = bustFunctionValue;

        return currentBall;
    }

    draw(ball) {
        this.drawer.drawFigure(this.figure);
        this.drawer.stepDraw(ball);
    }

    operationWithBall(ball) {
        ball = this.setBestValue(ball);
        ball = this.communicate(ball);
        const inPotential = this.figure.getPotential(ball.position.x, ball.position.y);
        this.balls[ball.id].inPotential = inPotential;
        if (inPotential) {
            ball.speed.x /= 2;
            ball.speed.y /= 2;
            ball.velocity /= 2;
        }
        this.balls[ball.id] = ball;

        return ball;
    }

    decreaseSmash() {
        if (this.balls.every(ball => this.figure.getPotential(ball.position.x, ball.position.y, 20))) {
            this.smashCoefficient -= 0.1;
        }
    }

    workerAnswerSubscription(worker) {
        worker.onmessage = (msg) => {
            this.postCount++;
            const model = JSON.parse(msg.data);
            this.balls[model.ball.id] = model.ball;
            this.balls[model.ball.id].worker = worker;
            if (this.postCount == this.balls.length) {
                this.postCount = 0;
                this.drawer.Init();
                this.balls.forEach((ball) => {
                    if (this.checkAllInPotential()) {
                        ball.speed.x = 0;
                        ball.speed.y = 0;
                        ball.velocity = 0;
                    }
                    ball = this.getAction(ball);
                    ball = this.operationWithBall(ball);
                    ball.nearestBalls = this.nearestBalls;
                    this.nearestBalls = [];
                });
                this.balls.forEach(ball => {
                    this.draw(ball);
                });
                this.decreaseSmash();
                if (this.checkAllInPotential()) {
                    this.stopWorkers();
                }

                this.sendDataToWorkers();
            }
        };
    }

    sendDataToWorkers() {
        this.balls.forEach((ball) => {
            const postModel = {
                ball,
            };
            const worker = ball.worker;
            delete ball.nearestBalls;
            delete ball.worker;
            worker.postMessage(JSON.stringify(postModel));
        });
    }


    getAction(ball) {
        switch (ball.currentAction) {
            case actionEnum.MOVE_TO_POTENTIAL_BASE:
                ball = this.actionList.moveToPotentialBase(ball);
                break;
        }

        return ball;
    }


    getPostModel(ball) {
        return {
            ball,
        };
    }

}