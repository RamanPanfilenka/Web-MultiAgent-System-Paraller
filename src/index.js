import { BallDrawer } from '@/paraller/ballDrawer';
import { MelodyDrawer } from '@/paraller/melodyDrawer';
import { enviroment } from '@/enviroment/enviroment';
import WorkerController from '@/js/workerController';
import { MelodyBall } from '@/js/model/melodyBall';
import Melody from '@/js/model/melody/melody';
import Note from '@/js/model/melody/note';
import { compositionService } from '@/js/service/compositionService';

const melodyData = [
    { orderNumber: 1,  noteId: 2,  time: 8 },
    { orderNumber: 2,  noteId: 20, time: 10 },
    { orderNumber: 3,  noteId: 4,  time: 12 },
    { orderNumber: 4,  noteId: 24, time: 13 },
    { orderNumber: 5,  noteId: 29, time: 17 },
    { orderNumber: 6,  noteId: 3,  time: 20 },
    { orderNumber: 7,  noteId: 17, time: 25 },
    { orderNumber: 8,  noteId: 10, time: 29 },
    { orderNumber: 9,  noteId: 35, time: 33 },
    { orderNumber: 10, noteId: 19, time: 37 },
    { orderNumber: 11, noteId: 8,  time: 41 },
    { orderNumber: 12, noteId: 18, time: 45 },
    { orderNumber: 13, noteId: 3,  time: 49 },
    { orderNumber: 14, noteId: 1,  time: 54 },
    { orderNumber: 15, noteId: 9,  time: 59 },
];

// const BallCount = 70;
// const balls = [...new Array(BallCount)].map((a, index) => new Ball(index, enviroment));

const melodyBallCount = 3;
const melodyCount = 36;
const melody = new Melody(melodyData);
let allNotes = [...new Array(melodyCount)].map((a, index) => new Note(index, 0,0));

window.onload = function() {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const noteDrawer = new MelodyDrawer(canvas, enviroment, new Melody([...melody.notes]));
    allNotes = noteDrawer.DrawNotes(allNotes);
    const melodyBalls = [...new Array(melodyBallCount)].map((a, index) => new MelodyBall(index, enviroment, melody, allNotes));
    const ballDrawer = new BallDrawer(canvas);
    //const workerController = new WorkerController(new shapeFillingService(balls, drawer, new Rect(1000,500,90)));
    const workerController = new WorkerController(new compositionService(allNotes, melodyBalls, melody, ballDrawer, noteDrawer));
    workerController.InitWorkers();
    workerController.RunWorkers();
};