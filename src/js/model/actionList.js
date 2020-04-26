import config from '@/config';

export default class ActionList {
    MoveToPotentialBase(ball) {
        this.Step(ball);
        this.CorrectSpeed(ball);

        return ball;
    }

    MoveToNote(ball, note) {
        this.CorrectDirection(ball, note);
        this.Step(ball);
    }

    CorrectDirection(ball, note) {
        const notePosition = note.position;
        const ballPosition = ball.Position;
        const dx = ballPosition.X - notePosition.x;
        const dy = ballPosition.Y - notePosition.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        ball.Angle = angle;

        ball.Speed.X = ball.Velocity * Math.cos(angle * Math.PI);
        ball.Speed.Y = ball.Velocity * Math.sin(angle * Math.PI);
    }

    CorrectSpeed(ball) {
        if (ball.BestFromAll != undefined) {
            ball.Speed.X = ball.Speed.X * 0.03 +
                0.2 * Math.random() * (ball.BestFunctionValue.X - ball.Position.X) +
                0.5 * Math.random() * (ball.BestFromAll.X - ball.Position.X);
            ball.Speed.Y = ball.Speed.Y * 0.03 +
                0.2 * Math.random() * (ball.BestFunctionValue.Y - ball.Position.Y) +
                0.5 * Math.random() * (ball.BestFromAll.Y - ball.Position.Y);
        } else {
            ball.Speed.X = ball.Speed.X * 0.3 +
                Math.random() * (ball.BestFunctionValue.X - ball.Position.X);
            ball.Speed.Y = ball.Speed.Y * 0.3 +
                Math.random() * (ball.BestFunctionValue.Y - ball.Position.Y);
        }
        ball.Speed.X /= 10;
        ball.Speed.Y /= 10;
    }

    Step(ball) {
        ball.PreviousPosition.X = ball.Position.X;
        ball.PreviousPosition.Y = ball.Position.Y;
        ball.Position.X += ball.Speed.X;
        ball.Position.Y += ball.Speed.Y;


        if (ball.Velocity > ball.Radius / 2) {
            ball.Velocity -= 0.5;
            ball.Speed.X = Math.cos(this, ball.Angle) * ball.Velocity;
            ball.Speed.Y = Math.sin(ball.Angle) * ball.Velocity;
        }

        if (ball.Position.X < 0) {
            ball.Position.X = 0;
            ball.Speed.X *= -1;
            ball = this.ChangeAngle(ball);
        } else if (ball.Position.X > config.width - config.BallRadius) {
            ball.Position.X = config.width - config.BalBallRadius;
            ball.Speed.X *= -1;
            ball = this.ChangeAngle(ball);
        }

        if (ball.Position.Y < 0) {
            ball.Position.Y = 0;
            ball.Speed.Y *= -1;
            ball = this.ChangeAngle(ball);
        } else if (ball.Position.Y > config.height - config.BalBallRadius) {
            ball.Position.Y = config.height - config.BaBallRadius;
            ball.Speed.Y *= -1;
            ball = this.ChangeAngle(ball);
        }
    }

    ChangeAngle(ball) {
        ball.Angle = Math.atan(ball.Speed.Y / ball.Speed.X);

        if (ball.Speed.X < 0)
            ball.Angle += Math.PI;
        if (ball.Speed.X !== 0)
            ball.Velocity = ball.Speed.X / Math.cos(ball.Angle);
        else
            ball.Velocity = ball.Speed.Y / Math.sin(ball.Angle);

        return ball;
    }
}