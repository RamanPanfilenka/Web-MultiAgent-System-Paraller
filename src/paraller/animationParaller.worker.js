import AlgotithmAnimation from '@/js/animation/algoritm';
import { enviroment } from '@/enviroment/enviroment';
import { MelodyBall } from '@/js/model/melodyBall';

let algorithmAnimation;

onmessage = function(msg) {
    const model = JSON.parse(msg.data);
    if (!algorithmAnimation) {
        algorithmAnimation = new AlgotithmAnimation(
            model.ball,
            model.enviroment,
        );
    }

    const ball = new MelodyBall(model.ball.id, enviroment, model.ball.melody, model.ball.allNotes);
    ball.CopyBall(model.ball);
    algorithmAnimation.ball = ball;
    algorithmAnimation.Anim();
};