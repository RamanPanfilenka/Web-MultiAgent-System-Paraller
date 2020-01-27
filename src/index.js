import Ball from '../src/js/model/ball';
import { Drawer } from './paraller/drawer';
import WorkerController from './js/workerController';


const BallCount = 60;
const balls = [...new Array(BallCount)].map((a, index) => new Ball(20, index));

window.onload = function() {
	const canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	const drawer = new Drawer(canvas);
	const workerController = new WorkerController(drawer, balls);
	workerController.InitWorkers();
	workerController.RunWorkers();
};
