import config from '@/config';

export default class ActionList {
    moveToPotentialBase(ball) {
        this.step(ball);
        this.correctSpeed(ball);

        return ball;
    }

    moveToNote(ball, note) {
        this.correctDirection(ball, note);
        this.step(ball);
    }

    correctDirection(ball, note) {
        const notePosition = note.position;
        const ballPosition = ball.position;
        const dx = ballPosition.x - notePosition.x;
        const dy = ballPosition.y - notePosition.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        ball.angle = angle;

        ball.speed.x = ball.velocity * Math.cos(angle * Math.PI);
        ball.speed.y = ball.velocity * Math.sin(angle * Math.PI);
    }

    correctSpeed(ball) {
        if (ball.bestFromAll != undefined) {
            ball.speed.x = ball.speed.x * 0.03 +
                0.2 * Math.random() * (ball.bestFunctionValue.x - ball.position.x) +
                0.5 * Math.random() * (ball.bestFromAll.y - ball.position.x);
            ball.speed.y = ball.speed.y * 0.03 +
                0.2 * Math.random() * (ball.bestFunctionValue.y - ball.position.y) +
                0.5 * Math.random() * (ball.bestFromAll.y - ball.position.y);
        } else {
            ball.speed.x = ball.speed.x * 0.3 +
                Math.random() * (ball.bestFunctionValue.x - ball.position.x);
            ball.speed.y = ball.speed.y * 0.3 +
                Math.random() * (ball.bestFunctionValue.y - ball.position.y);
        }
        ball.speed.x /= 10;
        ball.speed.y /= 10;
    }

    step(ball) {
        ball.previousPosition.x = ball.position.x;
        ball.previousPosition.y = ball.position.y;
        ball.position.x += ball.speed.x;
        ball.position.y += ball.speed.y;

        if (ball.velocity > ball.radius / 2) {
            ball.velocity -= 0.5;
            ball.speed.x = Math.cos(this, ball.angle) * ball.velocity;
            ball.speed.y = Math.sin(ball.angle) * ball.velocity;
        }

        if (ball.position.x < 0) {
            ball.position.x = 0;
            ball.speed.x *= -1;
            ball = this.changeAngle(ball);
        } else if (ball.position.x > config.width - config.ballRadius) {
            ball.position.x = config.width - config.ballRadius;
            ball.speed.x *= -1;
            ball = this.changeAngle(ball);
        }

        if (ball.position.y < 0) {
            ball.position.y = 0;
            ball.speed.y *= -1;
            ball = this.changeAngle(ball);
        } else if (ball.position.y > config.height - config.ballRadius) {
            ball.position.y = config.height - config.ballRadius;
            ball.speed.y *= -1;
            ball = this.changeAngle(ball);
        }
    }

    changeAngle(ball) {
        ball.angle = Math.atan(ball.speed.y / ball.speed.x);

        if (ball.speed.x < 0)
            ball.angle += Math.PI;
        if (ball.speed.x !== 0)
            ball.velocity = ball.speed.x / Math.cos(ball.angle);
        else
            ball.velocity = ball.speed.y / Math.sin(ball.angle);

        return ball;
    }
}