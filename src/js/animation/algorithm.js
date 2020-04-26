export default class AlgorithmAnimation {
    constructor(ball, environment) {
        this.ball = ball;
        this.environment = environment;
        this.nearestBalls = [];
    }

    Anim() {
        this.ball.Pondering(this.nearestBalls);
        this.ball.Sensive(self);
    }
}