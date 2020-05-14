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

const blackTones = ['C#', 'D#', 'F#', 'G#', 'A#'];
const whiteTones = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const whiteKeysCount = 50;
const blackKeysCount = 35;
const tonesCount = whiteKeysCount + blackKeysCount;
const keyWidht = 75;
const keyHeight = 300;

const melodyBallInitData: MelodyBallScheme = {
    speed: {
        value: 1,
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
        centerPoint : {x: x, y: black ? y + 5 : y},         //Not perfect sprites =(
        tone: tone,
        width: black ? keyWidht - 10 : keyWidht,
        height: black ? keyHeight / 2.2 : keyHeight,
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

const pianoKeySheme: PianoKeyScheme = {
    centerPoint: { x: 100, y : 100},
    size: 20,
    tone: 'Tone',
    width: 75,
    height: 300,
};
const canvans =  $('#view')[0];
const whiteKeys = getWhiteKeys();
const blackKeys = getBlackKeys();
const pianoKeys = whiteKeys.concat(blackKeys);

const renderer = new MelodyRenderer(canvans, window.innerWidth, window.innerHeight, whiteKeys, blackKeys);

const agents = [...new Array(5)].map(() => {
    melodyBallInitData.position.x = Math.random() * window.innerWidth;
    melodyBallInitData.position.y= Math.random() * window.innerHeight;
    const melodyBall = new MelodyBall(melodyBallInitData);
    const worker = new MelodyPlayerWorker();
    const process = new Process(worker);
    return new Agent(melodyBall, process);
});

const agentEnvironment = new AgentsEnvironment(agents, renderer);
agentEnvironment.run();



