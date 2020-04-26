import { forEach } from 'async-foreach';
import { enviroment } from '@/enviroment/enviroment';
import Worker from '@/paraller/animationParaller.worker.js';

export default class WorkerController {
    constructor(methodService) {
        this.workersStartObjects = [];
        this.methodService = methodService;
    }

    GetPostModel(ball) {
        return {
            ball: ball,
            enviroment: enviroment,
        };
    }

    InitWorkers() {
        this.methodService.balls.forEach(ball => {
            const worker = new Worker();
            const postModel = this.GetPostModel(ball);
            this.methodService.WorkerAnsverSubscription(worker);
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