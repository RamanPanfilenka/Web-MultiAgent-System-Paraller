export default function animationParaller() {
	let ballAnimation;
	let algorithmAnimation;
	let mainAnimationLoad = false;

	self.onmessage = function (msg) {
		let model = JSON.parse(msg.data);
		if (!mainAnimationLoad) {
			self.importScripts('http://10.10.224.229:8887/src/js/animation/animation.js');
			self.importScripts('http://10.10.224.229:8887/src/js/model/figures/circle.js');
			self.importScripts('http://10.10.224.229:8887/src/js/model/figures/rect.js');
			self.importScripts('http://10.10.224.229:8887/src/js/animation/algoritm.js');
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
					0,0,
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
}
