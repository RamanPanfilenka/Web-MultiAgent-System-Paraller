import Ball from '@/js/model/ball';
import { MelodyBall } from '@/js/model/melodyBall';

onmessage = function(msg) {
    const model = JSON.parse(msg.data);

    const ball = new MelodyBall(model.ball.id, model.ball.melody, model.ball.notes);
    // const ball = new Ball(model.ball.id);
    ball.copyBall(model.ball);
    ball.pondering();
    ball.sensive(self);
};