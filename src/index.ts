import MelodyPlayerWorker from '@mas/modules/melody-player/worker/melodyPlayer.worker';
import { Process } from '@mas/modules/common/agent/process';
import { MelodyBall, IMelodyBall } from '@mas/modules/melody-player/models/units/melodyBall';
import { Agent } from '@mas/modules/common/agent/agent';
import { AgentsEnvironment } from '@mas/modules/common/environment/agentsEnvironment';

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
