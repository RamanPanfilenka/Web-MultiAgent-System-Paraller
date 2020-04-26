export default class AlgorithmAnimation {
    constructor(ball) {
        this.ball = ball;
        this.nearestBalls = [];
    }

    Anim() {
        this.ball.Pondering(this.nearestBalls);
        this.ball.Sensive(self);
    }
}