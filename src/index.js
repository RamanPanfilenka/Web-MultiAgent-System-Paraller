import { BallDrawer } from '@/js/drawers/ballDrawer';
import { MelodyDrawer } from '@/js/drawers/melodyDrawer';
import Ball from '@/js/model/ball';
import Rect from '@/js/model/figures/rect';
import config from '@/config';
import WorkerController from '@/js/workerController';
import { MelodyBall } from '@/js/model/melodyBall';
import Melody from '@/js/model/melody/melody';
import Note from '@/js/model/melody/note';
import { CompositionService } from '@/js/service/compositionService';
import { ShapeFillingService } from '@/js/service/shapeFillingService';

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

const BallCount = 70;
const melodyBallCount = 3;
const melodyCount = 36;
const balls = [...new Array(BallCount)].map((a, index) => new Ball(index, config));
const allNotes = GetAllNotes(melodyCount);
const melody = new Melody(melodyData);

window.onload = function() {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const noteDrawer = new MelodyDrawer(canvas, new Melody([...melody.notes]));
    noteDrawer.drawNotes(allNotes);
    const melodyBalls = [...new Array(melodyBallCount)].map((a, index) => new MelodyBall(index, melody, allNotes));
    const ballDrawer = new BallDrawer(canvas);
    // const workerController = new WorkerController(new shapeFillingService(balls, ballDrawer, new Rect(1000,500,90)));
    const workerController = new WorkerController(new CompositionService(allNotes, melodyBalls, melody, ballDrawer, noteDrawer));
    workerController.initWorkers();
    workerController.runWorkers();
};

function GetAllNotes(count) {
    const screenWidth = config.width;
    const maxNotesInRow = Math.round(screenWidth / config.noteWidth) - 1;
    let startWidthPosition = config.noteWidth / 2;
    let startHeightPosition = config.noteHeight / 2;
    const allNotes = [...new Array(count)].map((a, index) => {
        if (index != 0 && (index) % maxNotesInRow == 0) {
            startHeightPosition += config.noteHeight;
            startWidthPosition = config.noteWidth / 2;
        }

        const x = startWidthPosition + config.noteHeight / 2;
        const y = startHeightPosition + config.noteHeight / 2;
        startWidthPosition += config.noteWidth;

        return new Note(index, x, y);
    });

    return allNotes;
}
