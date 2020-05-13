import MelodyPlayerWorker from '@mas/modules/melody-player/worker/melodyPlayer.worker';
import { Process } from '@mas/modules/common/agent/process';
import { MelodyBall, MelodyBallScheme } from '@mas/modules/melody-player/models/units/melodyBall';
import { Agent } from '@mas/modules/common/agent/agent';
import { AgentsEnvironment } from '@mas/modules/common/environment/agentsEnvironment';
import Renderer from './ui/renderer';
import $ from 'jquery';
import MelodyRenderer from './ui/melodyRenderer';
import { PianoKey, PianoKeyScheme } from './multiagent-system/modules/melody-player/models/primitives/pianoKey';


const melodyBallInitData: MelodyBallScheme = {
    speed: {
        value: 1,
        angle: 0,
    },
    position: {
        x: 0,
        y: 0,
    },
    connectionRange: 1000,
    radius: 10,
};
const pianoKeySheme: PianoKeyScheme = {
    centerPoint: { x: 100, y : 100},
    size: 20,
    tone: 'Tone',
};
const canvans =  $('#view')[0];
const pianoKeys = [...new Array(5)].map(() => new PianoKey(pianoKeySheme));


const renderer = new MelodyRenderer(canvans, window.innerWidth, window.innerHeight, pianoKeys);

const agents = [...new Array(5)].map(() => {
    const melodyBall = new MelodyBall(melodyBallInitData);
    const worker = new MelodyPlayerWorker();
    const process = new Process(worker);
    return new Agent(melodyBall, process);
});

const agentEnvironment = new AgentsEnvironment(agents, renderer);
agentEnvironment.run();


