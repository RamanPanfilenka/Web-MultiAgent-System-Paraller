import AlgorithmAnimation from '@/js/animation/algorithm';
import config from '@/config';
import Ball from '@/js/model/ball';
import { MelodyBall } from '@/js/model/melodyBall';

let algorithmAnimation;

onmessage = function(msg) {
    const model = JSON.parse(msg.data);
    if (!algorithmAnimation) {
        algorithmAnimation = new AlgorithmAnimation(
            model.ball,
        );
    }

    const ball = new MelodyBall(model.ball.id, model.ball.melody, model.ball.notes);
    // const ball = new Ball(model.ball.id, config);
    ball.CopyBall(model.ball);
    algorithmAnimation.ball = ball;
    algorithmAnimation.Anim();
};