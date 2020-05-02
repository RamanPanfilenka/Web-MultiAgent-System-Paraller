import Message from './message';
import MessageTypes from './messageTypes';
import PonderingData from './ponderingData';

export default class Process {
    private worker: Worker;

    constructor(worker: Worker, initialData?: any) {
        this.worker = worker;
        if (initialData) {
            const message: Message = {
                type: MessageTypes.INITIAL_DATA,
                data: initialData,
            };
            this.sendMessage(message);
        }
    }

    private sendMessage(message: Message) {
        this.worker.postMessage(message);
    }

    async ponder<T>(ponderData: PonderingData<T>) {
        const message: Message = {
            type: MessageTypes.PONDERING_DATA,
            data: ponderData,
        };
        const ponderingPromise = new Promise(resolve => {
            this.worker.onmessage = (event: MessageEvent) => {
                const unit: T = event.data;
                resolve(unit);
            };
            this.sendMessage(message);
        });

        return ponderingPromise;
    }
}