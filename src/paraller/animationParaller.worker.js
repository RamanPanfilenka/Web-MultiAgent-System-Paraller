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
            model.environment,
        );
    }

    // const ball = new MelodyBall(model.ball.id, config, model.ball.melody, model.ball.allNotes);
    const ball = new Ball(model.ball.id, config);
    ball.CopyBall(model.ball);
    algorithmAnimation.ball = ball;
    algorithmAnimation.Anim();
};