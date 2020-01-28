import AlgotithmAnimation from 'js/animation/algoritm';
import { modelStatusEnum } from '../js/modelStatusEnum';

let algorithmAnimation;

onmessage = function(msg) {
	const model = JSON.parse(msg.data);
	switch (model.status) {
		case modelStatusEnum.new:
			algorithmAnimation = new AlgotithmAnimation(
				model.ball,
				model.enviroment
			);
			algorithmAnimation.Anim();
			break;
	}
	algorithmAnimation.ball = model.ball;
};

