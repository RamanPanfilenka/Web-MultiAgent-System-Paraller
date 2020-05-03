import MelodyPlayerWorker from '@mas/modules/melodyPlayer/melodyPlayer.worker';
import Process from '@mas/modules/common/models/process';
import { MelodyBall, IMelodyBall } from './multiagent-system/modules/melodyPlayer/models/units/melodyBall';
import { Point } from './multiagent-system/modules/common/models/point';
import { Speed } from './multiagent-system/modules/common/models/speed';
import Agent from './multiagent-system/modules/common/models/agent';
import AgentsEnvironment from './multiagent-system/modules/common/models/agentsEnvironment';

const complexData = {
    some: 10,
    body: 10,
    just: 10,
    told: 10,
};

const worker = new MelodyPlayerWorker();
const process = new Process(worker, complexData);
const melodyBallCount = 3;
const speed = new Speed({value : 1, angle: 0});
const position = new Point({x : 0, y : 0});
const melodyBallInitData: IMelodyBall = {
    speed : speed,
    position : position,
    connectionRange : 1000,
    radius : 10,
};
const melodyBalls = [...new Array(melodyBallCount)].map(() => new MelodyBall(melodyBallInitData));

const agents = [...new Array(melodyBalls)].map((a, index) => new Agent(melodyBalls[index], process));
const agentEnviroment = new AgentsEnvironment(agents);
agentEnviroment.run();
