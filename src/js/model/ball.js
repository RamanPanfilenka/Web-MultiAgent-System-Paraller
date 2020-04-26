import config from '@/config';
import { actionEnum } from '../helpers/actionListEnum';

export default class Ball {
    constructor(id) {
        this.id = id;
        this.Radius = config.BallRadius;
        const randX = Math.random() * config.width;
        const randY = Math.random() * config.height;
        const vel = config.defaultVelocity;
        const rad = Math.random() * Math.PI * 2;

        this.Position = { X: randX, Y: randY };
        this.PreviousPosition = { X: randX, Y: randY };
        this.Speed = {
            X: Math.cos(rad) * vel * 5,
            Y: Math.sin(rad) * vel * 5,
        };

        this.Velocity = vel;
        this.Angle = rad;
        this.BestFunctionValue = { X: randX, Y: randY };
        this.ConnectRadius = 600;
        this.isPotential = false;
        this.nearestBalls = [];
    }

    CopyBall(ball) {
        this.Position = ball.Position;
        this.PreviousPosition = ball.PreviousPosition;
        this.Speed = ball.Speed;
        this.Velocity = ball.Velocity;
        this.Angle = ball.Angle;
        this.BestFunctionValue = ball.BestFunctionValue;
        this.BestFromAll = ball.BestFromAll;
        this.isPotential = ball.isPotential;
        this.nearestBalls = ball.nearestBalls;
    }

    Sensive(worker) {
        const postMessage = {
            ball: this,
        };
        worker.postMessage(JSON.stringify(postMessage));
    }

    Pondering(nearestBalls) {
        this.currentAction = actionEnum.moveToPotentialBase;
    }
}