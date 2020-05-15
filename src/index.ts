import MelodyPlayerWorker from '@mas/modules/melody-player/worker/melodyPlayer.worker';
import { Process } from '@mas/modules/common/agent/process';
import { MelodyBall, MelodyBallScheme } from '@mas/modules/melody-player/models/units/melodyBall';
import { Agent } from '@mas/modules/common/agent/agent';
import { AgentsEnvironment } from '@mas/modules/common/environment/agentsEnvironment';
import Renderer from './ui/renderer';
import $ from 'jquery';
import MelodyRenderer from './ui/melodyRenderer';
import { PianoKey, PianoKeyScheme } from './multiagent-system/modules/melody-player/models/primitives/pianoKey';
import { Note, NoteScheme } from './multiagent-system/modules/melody-player/models/primitives/note';
import { Midi } from '@tonejs/midi';
import { Melody } from './multiagent-system/modules/melody-player/models/melody';
import { MelodyPlayerWorkerData } from './multiagent-system/modules/melody-player/models/messages/melodyPlayerWorkerData';

const blackTones = ['C#', 'D#', 'F#', 'G#', 'A#'];
const whiteTones = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const whiteKeysCount = 50;
const blackKeysCount = 35;
const tonesCount = whiteKeysCount + blackKeysCount;
const keyWidht = 75;
const keyHeight = 300;
const blackKeyHeight = keyHeight / 2.2;

const melodyBallInitData: MelodyBallScheme = {
    id: 0,
    speed: {
        value: 2,
        angle: 0,
    },
    position: {
        x: 0,
        y: 100,
    },
    connectionRange: 1000,
    radius: 10,
};


function whiteKeysAddingWidth(startWidhtPosition: number, startHeightPosition: number, tone: string): any {
    startWidhtPosition += keyWidht;
    return {startWidhtPosition: startWidhtPosition, startHeightPosition: startHeightPosition};
}

function isSkipNext(tone: string) {
    return tone.includes('D') || tone.includes('A');
}


function blackKeysAddingWidth(startWidhtPosition: number, startHeightPosition: number, tone: string) {
    const skipNext = isSkipNext(tone);
    startWidhtPosition += skipNext
        ? keyWidht * 2
        : keyWidht;
    return {startWidhtPosition: startWidhtPosition, startHeightPosition: startHeightPosition};
}

function isBlack(tone: string) {
    return tone.includes('#');
}

function getPianoKey(x: number, y: number, tone: string) {
    const black = isBlack(tone);
    const pianoKeySheme: PianoKeyScheme = {
        size: 20,
        centerPoint : {x: x + keyWidht / 2, y: black ? y + 5 + blackKeyHeight / 2 : y + keyHeight / 2},         //Not perfect sprites =(
        tone: tone,
        width: black ? keyWidht - 10 : keyWidht,
        height: black ? blackKeyHeight : keyHeight,
        isPressed: false,
    };
    const note = new PianoKey(pianoKeySheme);
    return note;
}

function getPianoKeys(pianoKeysCount: number, tones: Array<string> , startWidhtPosition: number, startHeightPosition: number, widthAddingFunction: any) {
    const firstWidthPosition = startWidhtPosition;
    let octaves = 1;
    let toneNumber = -1;
    let position = {startWidhtPosition: startWidhtPosition, startHeightPosition: startHeightPosition};
    const pianoKeys = [...new Array(pianoKeysCount)].map(() => {
        toneNumber++;
        if (toneNumber == tones.length) {
            toneNumber = 0;
            octaves++;
        }

        const x = position.startWidhtPosition;
        const y = position.startHeightPosition;
        const tone = tones[toneNumber] + octaves;
        const pianoKey = getPianoKey(x, y, tone);

        position = widthAddingFunction(position.startWidhtPosition, position.startHeightPosition, tone);
        if (position.startWidhtPosition > window.innerWidth - keyWidht * 1.5) {
            position.startWidhtPosition = firstWidthPosition;
            position.startHeightPosition += keyHeight;
        }
        return pianoKey;
    });
    return pianoKeys;
}

function getWhiteKeys() {
    const whiteKeys = getPianoKeys(whiteKeysCount, whiteTones, 0, window.innerHeight / 6, whiteKeysAddingWidth);
    return whiteKeys;
}

function getBlackKeys() {
    const blackKeys = getPianoKeys(blackKeysCount, blackTones, keyWidht / 1.8, window.innerHeight / 6, blackKeysAddingWidth);
    return blackKeys;
}

function playMelody(melody: Melody) {
    const canvans =  $('#view')[0];
    const whiteKeys = getWhiteKeys();
    const blackKeys = getBlackKeys();
    const pianoKeys = whiteKeys.concat(blackKeys);
    const renderer = new MelodyRenderer(canvans, window.innerWidth, window.innerHeight, whiteKeys, blackKeys);
    const melodyPlayerWorkerData: MelodyPlayerWorkerData = {
        melody: melody.notes,
        pianoKeys: pianoKeys,
        startTime: Date.now(),
    };
    const agents = [...new Array(4)].map((a, index) => {
        melodyBallInitData.id = index;
        melodyBallInitData.position.x = Math.random() * window.innerWidth;
        melodyBallInitData.position.y= Math.random() * window.innerHeight;
        const melodyBall = new MelodyBall(melodyBallInitData);
        const worker = new MelodyPlayerWorker();
        const process = new Process(worker, melodyPlayerWorkerData);
        return new Agent(melodyBall, process);
    });

    const agentEnvironment = new AgentsEnvironment(agents, renderer);
    agentEnvironment.run();
}

function getMelody(midi: Midi) {
    const track = midi.tracks[0];
    const trackNotes = track.notes;
    const notes = [...new Array(track.notes.length)].map((a, index)=>{
        return {
            orderNumber: index + 1,
            tone: trackNotes[index].name,
            duration: trackNotes[index].duration,
            playTime: trackNotes[index].time + 4,
        };
    });
    return new Melody(notes);
}

function parseFile(file: File) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileArray = <ArrayBuffer>e.target.result;
        const midi = new Midi(fileArray);
        const melody = getMelody(midi);
        playMelody(melody);
    };
    reader.readAsArrayBuffer(file);
}


function handler() {
    const file = this.files[0];
    parseFile(file);
}

function readMidi() {
    const source = $('#filereader');
    source.change(handler);
}

$(document).ready(() => {
    readMidi();
});



