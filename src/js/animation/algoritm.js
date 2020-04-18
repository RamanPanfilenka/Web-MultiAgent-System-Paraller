export default class AlgotithmAnimation {
    constructor(ball, enviroment) {
        this.ball = ball;
        this.enviroment = enviroment;
        this.nearestBalls = [];
    }

    Anim() {
        this.ball.Pondering(this.nearestBalls);
        this.ball.Sensive(self);
    }
}