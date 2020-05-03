import { Message, MessageTypes } from './message';
import PonderingData from './ponderingData';

export default class Process {
    private worker: Worker;

    constructor(worker: Worker, initialData?: any) {
        this.worker = worker;
        if (initialData) {
            const message = this.createMessage(MessageTypes.INITIAL_DATA, initialData);
            this.sendMessage(message);
        }
    }

    private createMessage(type: MessageTypes, data: any): Message {
        const message: Message = {
            type,
            data,
        };

        return message;
    }

    private sendMessage(message: Message) {
        this.worker.postMessage(message);
    }

    private setOnMessageEventHandler(callback: Function) {
        this.worker.onmessage = (event: MessageEvent) => {
            const unit = event.data;
            callback(unit);
        };
    }

    async runPondering(ponderingData: PonderingData) {
        const message = this.createMessage(MessageTypes.PONDERING_DATA, ponderingData);
        const ponderingPromise = new Promise(resolve => {
            this.setOnMessageEventHandler(resolve);
            this.sendMessage(message);
        });

        return ponderingPromise;
    }

    terminate() {
        this.worker.terminate();
    }
}