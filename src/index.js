import { MidiParser } from 'midi-parser-js';
import { Midi } from '@tonejs/midi';
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
const melodyBallCount = 2;
const melodyCount = 56;
const balls = [...new Array(BallCount)].map((a, index) => new Ball(index, enviroment));
const tonos = ['A','B', 'C', 'D', 'E', 'F', 'G'];
const allNotes = GetAllNotes(melodyCount);

window.onload = function() {
    ReadMidi();
};

function PlayMidi(midi){
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const melody = GetMelody(midi);
    const noteDrawer = new MelodyDrawer(canvas, enviroment, new Melody([...melody.notes]));
    noteDrawer.DrawNotes(allNotes);
    const melodyBalls = [...new Array(melodyBallCount)].map((a, index) => new MelodyBall(index, enviroment, melody, allNotes));
    const ballDrawer = new BallDrawer(canvas);
    //const workerController = new WorkerController(new shapeFillingService(balls, drawer, new Rect(1000,500,90)));
    const workerController = new WorkerController(new compositionService(allNotes, melodyBalls, melody, ballDrawer, noteDrawer));
    workerController.InitWorkers();
    workerController.RunWorkers();
}

function GetAllNotes(count){
    const screenWidth = enviroment.width;
    const maxNotesInRow = Math.round(screenWidth / enviroment.noteWidth) - 1;
    let startWidhtPosition = enviroment.noteWidth / 2;
    let startHeightPosition = enviroment.noteHeight / 2;
    let octaves = 1;
    let toneNumber = -1;
    const allNotes = [...new Array(count)].map((a, index) => {
        toneNumber++;
        if(toneNumber == tonos.length){
            toneNumber = 0;
        }
        if(index != 0 && (index) % maxNotesInRow == 0){
            startHeightPosition += enviroment.noteHeight;
            startWidhtPosition = enviroment.noteWidth / 2;
        }

        if(index != 0  && index % 7 == 0){
            octaves++;
        }

        const x = startWidhtPosition + enviroment.noteHeight / 2;
        const y = startHeightPosition + enviroment.noteHeight / 2;
        startWidhtPosition += enviroment.noteWidth;
        const note = new Note(index, x, y, tonos[toneNumber] + octaves)
        return note;
    });

    return allNotes;
}

function ReadMidi(){
    const source = document.getElementById('filereader');
    source.addEventListener('change', Handler, false);

}

function Handler(){
    const file = this.files[0];
    ParseFile(file);
}

function ParseFile(file){
    const reader = new FileReader()
    reader.onload = function(e){
        const midi = new Midi(e.target.result)
        PlayMidi(midi);
    }
    reader.readAsArrayBuffer(file);
}

function GetMelody(midi){
    const track = midi.tracks[0];
    let notes = [];
    track.notes.forEach((note, index) => {
        const noteId = allNotes.find(elem => elem.tone == note.name).id;
        notes.push({orderNumber: index + 1, noteId: noteId, time: note.time + 4});
    });
    return new Melody(notes);
}