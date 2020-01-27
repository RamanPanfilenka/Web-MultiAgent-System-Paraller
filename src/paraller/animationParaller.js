import AlgotithmAnimation from 'js/animation/algorithm';
import BallAnimation from 'js/animation/animation';
import Circle from 'js/model/figures/circle';

let ballAnimation;
let algorithmAnimation;
let mainAnimationLoad = false;

onmessage = function(msg) {
	let model = JSON.parse(msg.data);
	if (!mainAnimationLoad) {
		ballAnimation = new BallAnimation(model.ball, [], [], model.enviroment);
		mainAnimationLoad = !mainAnimationLoad;
	}
	switch (model.status) {
		case 'up':
			ballAnimation.Anim();
			break;
		case 'new':
			algorithmAnimation = new AlgotithmAnimation(
				model.ball,
				0,
				0,
				new Circle(1000, 500, 148),
				model.enviroment,
				ballAnimation
			);
			algorithmAnimation.Anim();
			break;
	}
	updateNearest(model);
};

function updateNearest(model) {
	if (model.ballsInRadius == undefined) {
		algorithmAnimation.ballanimation.ballsInRadius = [];
	} else {
		algorithmAnimation.ballanimation.ballsInRadius= model.ballsInRadius;
	}

	if (model.nearsBalls == undefined) {
		algorithmAnimation.ballanimation.nearest = [];
	} else {
		algorithmAnimation.ballanimation.nearest = model.nearsBalls;
	}
}
