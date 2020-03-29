import Ball from 'js/model/ball';
import { Drawer } from 'paraller/drawer';
import WorkerController from 'js/workerController';
import Circle from './js/model/figures/circle';
import Rect from './js/model/figures/rect';
import { enviroment } from '../src/enviroment/enviroment'
import { shapeFillingService } from './js/service/shapeFillingService';


const BallCount = 70;
const balls = [...new Array(BallCount)].map((a, index) => new Ball(index, enviroment));

window.onload = function() {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const drawer = new Drawer(canvas);
    const workerController = new WorkerController(new shapeFillingService(balls, drawer, new Rect(1000,500,90)));
    workerController.InitWorkers();
    workerController.RunWorkers();
};