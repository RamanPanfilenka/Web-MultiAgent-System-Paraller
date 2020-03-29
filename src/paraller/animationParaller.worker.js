import AlgotithmAnimation from 'js/animation/algoritm';
import Ball from '../js/model/ball';
import { enviroment } from '../enviroment/enviroment';

let algorithmAnimation;

onmessage = function(msg) {
    const model = JSON.parse(msg.data);
    if (!algorithmAnimation) {
        algorithmAnimation = new AlgotithmAnimation(
            model.ball,
            model.enviroment
        );
    }
    
    const ball = new Ball(model.ball.id, enviroment);
    ball.CopyBall(model.ball);
    algorithmAnimation.ball = ball;
    algorithmAnimation.Anim();
};