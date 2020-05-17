import { MelodyBallScheme } from '@mas/modules/melody-player/models/units/melodyBall';
import $ from 'jquery';
import { Midi } from '@tonejs/midi';
import { Melody } from './multiagent-system/modules/melody-player/models/melody';
import { MelodyPlayerFactory } from './multiagent-system/modules/melody-player/factory/melodyPlayerFactory';
import { Point } from 'pixi.js';
import { RendererOps } from './ui/renderer';
import { StatisticRenderer } from './ui/statisticsRenderer';

const ballTextureUrl = require('./ui/asserts/ball.png').default;
const backgroundColor = 0xffffff;
const canvans =  $('#view')[0];
const rendererOps: RendererOps = {
    canvans: canvans,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: backgroundColor,
};


async function playMelody(melody: Melody) {
    const agentsCount = 6;
    const angentsInitData = [...new Array(agentsCount)].map((a, index) =>{
        const melodyBallInitData: MelodyBallScheme = {
            id: index,
            speed: {
                value: 2,
                angle: 0,
            },
            position: new Point(Math.random() * window.innerWidth, Math.random() * window.innerHeight),
            connectionRange: 1000,
            radius: 10,
            width: 40,
            height: 40,
            textureUrl: ballTextureUrl,
            statistics: {
                distanceTraveled: 20,
            },
        };
        return melodyBallInitData;
    });
    const stat = angentsInitData.map(elem => elem.statistics);
    const t = new StatisticRenderer(canvans);
    t.render(stat);
    // const melodyFactory = new MelodyPlayerFactory();
    // const enviroment = melodyFactory.getEnviroment(angentsInitData,rendererOps, melody);
    // const startTime = Date.now();
    // const lastNoteTime = melody.notes[melody.notes.length - 1].playTime;
    // while ((Date.now() - startTime) / 600  < lastNoteTime) {
    //     await enviroment.run();
    // }

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

async function parseFile(file: File) {
    const reader = new FileReader();
    reader.onload = await async function(e) {
        const fileArray = <ArrayBuffer>e.target.result;
        const midi = new Midi(fileArray);
        const melody = getMelody(midi);
        await playMelody(melody);
    };
    reader.readAsArrayBuffer(file);
}


async function handler() {
    const file = this.files[0];
    await parseFile(file);
}

async function readMidi() {
    const source = $('#filereader');
    source.change(handler);
}

$(document).ready(async () => {
    readMidi();
});



