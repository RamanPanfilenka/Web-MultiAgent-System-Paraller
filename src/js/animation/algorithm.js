export default class AlgorithmAnimation {
    constructor(ball) {
        this.ball = ball;
        this.nearestBalls = [];
    }

    anim() {
        this.ball.pondering(this.nearestBalls);
        this.ball.sensive(self);
    }
}