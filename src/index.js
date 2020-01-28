import Ball from 'js/model/ball';
import { Drawer } from 'paraller/drawer';
import WorkerController from 'js/workerController';
import Circle from './js/model/figures/circle';


const BallCount = 30;
const balls = [...new Array(BallCount)].map((a, index) => new Ball(100, index));

window.onload = function() {
	const canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	const drawer = new Drawer(canvas);
	const workerController = new WorkerController(drawer, balls, new Circle(1000, 500, 95));
	workerController.InitWorkers();
	workerController.RunWorkers();
};
