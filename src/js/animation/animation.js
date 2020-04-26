import { modelStatusEnum } from '../modelStatusEnum';

export default class BallAnimation {
    constructor(ball) {
        this.ball = ball;
    }

    Anim() {
        let postModel = { status: modelStatusEnum.start, ball: this.ball, additionalBall: null };
        postMessage(JSON.stringify(postModel));
        setInterval(() => {
            this.ball = this.Step(this.ball);
            postModel.status = modelStatusEnum.step;
            postModel.ball = this.ball;
            postMessage(JSON.stringify(postModel));
        }, 50);
    }


}