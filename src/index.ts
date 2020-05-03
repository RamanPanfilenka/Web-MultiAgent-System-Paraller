import MelodyPlayerWorker from '@mas/modules/melodyPlayer/melodyPlayer.worker';
import Process from '@mas/modules/common/models/process';

const complexData = {
    some: 10,
    body: 10,
    just: 10,
    told: 10,
};

const worker = new MelodyPlayerWorker();
const process = new Process(worker, complexData);

worker.onmessage = (event: MessageEvent) => {
    console.log(event.data);
};
