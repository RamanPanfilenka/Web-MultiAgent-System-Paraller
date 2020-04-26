import { forEach } from 'async-foreach';
import config from '@/config';
import Worker from '@/paraller/animationParaller.worker.js';

export default class WorkerController {
    constructor(methodService) {
        this.workersStartObjects = [];
        this.methodService = methodService;
    }

    getPostModel(ball) {
        return {
            ball: ball,
            environment: config,
        };
    }

    initWorkers() {
        this.methodService.balls.forEach(ball => {
            const worker = new Worker();
            const postModel = this.getPostModel(ball);
            this.methodService.workerAnswerSubscription(worker);
            const workerStartObject = {
                worker,
                postModel,
            };
            this.workersStartObjects.push(workerStartObject);
        });
    }

    runWorkers() {
        forEach(this.workersStartObjects, obj => {
            obj.worker.postMessage(JSON.stringify(obj.postModel));
        });
    }
}