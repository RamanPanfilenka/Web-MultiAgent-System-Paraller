import config from '@/config';
import { actionEnum } from '../enums/actionListEnum';

export default class Ball {
    constructor(id) {
        this.id = id;
        this.radius = config.ballRadius;
        const randX = Math.random() * config.width;
        const randY = Math.random() * config.height;
        const vel = config.defaultVelocity;
        const rad = Math.random() * Math.PI * 2;

        this.position = { x: randX, y: randY };
        this.previousPosition = { x: randX, y: randY };
        this.speed = {
            x: Math.cos(rad) * vel * 5,
            y: Math.sin(rad) * vel * 5,
        };

        this.velocity = vel;
        this.angle = rad;
        this.bestFunctionValue = { x: randX, y: randY };
        this.connectRadius = 600;
        this.isPotential = false;
        this.nearestBalls = [];
    }

    copyBall(ball) {
        this.position = ball.position;
        this.previousPosition = ball.previousPosition;
        this.speed = ball.speed;
        this.velocity = ball.velocity;
        this.angle = ball.angle;
        this.bestFunctionValue = ball.bestFunctionValue;
        this.BestFromAll = ball.bestFromAll;
        this.isPotential = ball.isPotential;
        this.nearestBalls = ball.nearestBalls;
    }

    sensive(worker) {
        const postMessage = {
            ball: this,
        };
        worker.postMessage(JSON.stringify(postMessage));
    }

    pondering() {
        this.currentAction = actionEnum.MOVE_TO_POTENTIAL_BASE;
    }
}