import Ball from 'js/model/ball';
import { BallDrawer } from 'paraller/ballDrawer';
import WorkerController from 'js/workerController';
import Circle from './js/model/figures/circle';
import Rect from './js/model/figures/rect';
import { enviroment } from '../src/enviroment/enviroment'
import { shapeFillingService } from './js/service/shapeFillingService';
import Note from './js/model/melody/note';
import { MelodyDrawer } from './paraller/melodyDrawer';
import { MelodyBall } from './js/model/melodyBall';
import Melody from './js/model/melody/melody';


const BallCount = 70;
const melodyBallCount = 10;
const melodyCount = 144;
const balls = [...new Array(BallCount)].map((a, index) => new Ball(index, enviroment));
const melody = new Melody([1,5,40,130,17], [10, 12, 15, 13, 5]);
let allNotes = [...new Array(melodyCount)].map((a, index) => new Note(index, 0,0));

window.onload = function() {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const drawer = new MelodyDrawer(canvas, enviroment);
    allNotes = drawer.DrawNotes(allNotes);
    const melodyBalls = [...new Array(melodyBallCount)].map((a, index) => new MelodyBall(index, enviroment, melody, allNotes));
    //const drawer = new BallDrawer(canvas);
    //const workerController = new WorkerController(new shapeFillingService(balls, drawer, new Rect(1000,500,90)));
    //workerController.InitWorkers();
    //workerController.RunWorkers();
};