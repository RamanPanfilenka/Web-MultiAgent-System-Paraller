import MelodyPlayerWorker from '@mas/modules/melodyPlayer/melodyPlayer.worker';

const worker = new MelodyPlayerWorker();

worker.onmessage = (event: MessageEvent) => {
    console.log(event.data);
};

const complexData = {
    some: 10,
    body: 10,
    just: 10,
    told: 10,
};

worker.postMessage(complexData);