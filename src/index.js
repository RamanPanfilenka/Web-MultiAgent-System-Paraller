import { Midi } from '@tonejs/midi';
import Ball from '@/js/model/ball';
import { BallDrawer } from '@/js/drawers/ballDrawer';
import WorkerController from '@/js/workerController';
import Circle from '@/js/model/figures/circle';
import Rect from '@/js/model/figures/rect';
import config  from '@/config';
import { ShapeFillingService } from '@/js/service/shapeFillingService';
import Note from '@/js/model/melody/note';
import { MelodyDrawer } from '@/js/drawers/melodyDrawer';
import { MelodyBall } from '@/js/model/melodyBall';
import Melody from '@/js/model/melody/melody';
import { CompositionService } from '@/js/service/compositionService';
import Worker from "@/multiagent-system/modules/melodyPlayer/melodyProcess.process.ts"

const BallCount = 70;
const melodyBallCount = 2;
const melodyCount = 56;
const balls = [...new Array(BallCount)].map((a, index) => new Ball(index, config));
const tones = ['A','B', 'C', 'D', 'E', 'F', 'G'];
const allNotes = getAllNotes(melodyCount);

window.onload = function() {
    //readMidi();
    const worker = new Worker();
    worker.onmessage = (msg) => {
        this.console.log(msg);
    }
    worker.postMessage('');
};

function playMidi(midi) {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const melody = getMelody(midi);
    const noteDrawer = new MelodyDrawer(canvas, new Melody([...melody.notes]));
    noteDrawer.drawNotes(allNotes);
    const melodyBalls = [...new Array(melodyBallCount)].map((a, index) => new MelodyBall(index, melody, allNotes));
    const ballDrawer = new BallDrawer(canvas);
    //const workerController = new WorkerController(new ShapeFillingService(balls, drawer, new Rect(1000,500,90)));
    const workerController = new WorkerController(new CompositionService(allNotes, melodyBalls, melody, ballDrawer, noteDrawer));
    workerController.initWorkers();
    workerController.runWorkers();
}

function getAllNotes(count) {
    const screenWidth = config.width;
    const maxNotesInRow = Math.round(screenWidth / config.noteWidth) - 1;
    let startWidhtPosition = config.noteWidth / 2;
    let startHeightPosition = config.noteHeight / 2;
    let octaves = 1;
    let toneNumber = -1;
    const allNotes = [...new Array(count)].map((a, index) => {
        toneNumber++;
        if (toneNumber == tones.length) {
            toneNumber = 0;
        }
        if (index != 0 && (index) % maxNotesInRow == 0) {
            startHeightPosition += config.noteHeight;
            startWidhtPosition = config.noteWidth / 2;
        }

        if (index != 0  && index % 7 == 0) {
            octaves++;
        }

        const x = startWidhtPosition + config.noteHeight / 2;
        const y = startHeightPosition + config.noteHeight / 2;
        startWidhtPosition += config.noteWidth;
        const note = new Note(index, x, y, tones[toneNumber] + octaves);

        return note;
    });

    return allNotes;
}

function readMidi() {
    const source = document.getElementById('filereader');
    source.addEventListener('change', handler, false);

}

function handler() {
    const file = this.files[0];
    parseFile(file);
}

function parseFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const midi = new Midi(e.target.result);
        playMidi(midi);
    };
    reader.readAsArrayBuffer(file);
}

function getMelody(midi) {
    const track = midi.tracks[0];
    const notes = [];
    track.notes.forEach((note, index) => {
        const noteId = allNotes.find(elem => elem.tone == note.name).id;
        notes.push({orderNumber: index + 1, noteId: noteId, time: note.time + 4});
    });

    return new Melody(notes);
}