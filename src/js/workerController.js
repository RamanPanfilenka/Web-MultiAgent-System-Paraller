import { forEach } from 'async-foreach';
import config from '@/config';
import Worker from '@/paraller/animationParaller.worker.js';

export default class WorkerController {
    constructor(methodService) {
        this.workersStartObjects = [];
        this.methodService = methodService;
    }

    GetPostModel(ball) {
        return {
            ball: ball,
            environment: config,
        };
    }

    InitWorkers() {
        this.methodService.balls.forEach(ball => {
            const worker = new Worker();
            const postModel = this.GetPostModel(ball);
            this.methodService.WorkerAnswerSubscription(worker);
            const workerStartObject = {
                worker,
                postModel,
            };
            this.workersStartObjects.push(workerStartObject);
        });
    }

    RunWorkers() {
        forEach(this.workersStartObjects, obj => {
            obj.worker.postMessage(JSON.stringify(obj.postModel));
        });
    }
}