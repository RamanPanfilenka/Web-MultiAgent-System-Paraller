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
import { compositionService } from './js/service/compositionService';


const BallCount = 70;
const melodyBallCount = 3;
const melodyCount = 144;
const balls = [...new Array(BallCount)].map((a, index) => new Ball(index, enviroment));
const melody = new Melody([{orderNumber: 1, noteId: 19}, 
                            {orderNumber: 2, noteId: 20}, 
                            {orderNumber: 3, noteId: 119},
                            {orderNumber: 4, noteId: 55},
                            {orderNumber: 5, noteId: 80},
                            {orderNumber: 6, noteId: 15}, 
                            {orderNumber: 7, noteId: 88}, 
                            {orderNumber: 8, noteId: 73},
                            {orderNumber: 9, noteId: 115},
                            {orderNumber: 10, noteId: 28},
                            {orderNumber: 11, noteId: 37}, 
                            {orderNumber: 12, noteId: 57}, 
                            {orderNumber: 13, noteId: 106},
                            {orderNumber: 14, noteId: 66},
                            {orderNumber: 15, noteId: 51}], [5, 10, 12, 13, 17,20, 25, 29, 33, 37,41, 45, 49, 54, 59]);
let allNotes = [...new Array(melodyCount)].map((a, index) => new Note(index, 0,0));

window.onload = function() {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const noteDrawer = new MelodyDrawer(canvas, enviroment);
    allNotes = noteDrawer.DrawNotes(allNotes);
    const melodyBalls = [...new Array(melodyBallCount)].map((a, index) => new MelodyBall(index, enviroment, melody, allNotes));
    const ballDrawer = new BallDrawer(canvas);
    //const workerController = new WorkerController(new shapeFillingService(balls, drawer, new Rect(1000,500,90)));
    const workerController = new WorkerController(new compositionService(allNotes, melodyBalls, melody, ballDrawer, noteDrawer));
    workerController.InitWorkers();
    workerController.RunWorkers();
};