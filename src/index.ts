import MelodyPlayerWorker from '@mas/modules/melodyPlayer/melodyPlayer.worker';
import { Process } from '@mas/modules/common/models/process';
import { MelodyBall, IMelodyBall } from './multiagent-system/modules/melodyPlayer/models/units/melodyBall';
import { Agent } from './multiagent-system/modules/common/models/agent';
import { AgentsEnvironment } from './multiagent-system/modules/common/models/agentsEnvironment';

const melodyBallInitData: IMelodyBall = {
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

const agents = [...new Array(5)].map(() => {
    const melodyBall = new MelodyBall(melodyBallInitData);
    const worker = new MelodyPlayerWorker();
    const process = new Process(worker);
    return new Agent(melodyBall, process);
});

const agentEnvironment = new AgentsEnvironment(agents);
agentEnvironment.run();
