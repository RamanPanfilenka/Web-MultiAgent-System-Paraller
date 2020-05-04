import { Message, MessageTypes } from './message';
import { PonderingData } from './ponderingData';
import { IUnit } from './units/unit';

export class Process {
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

    private sendMessage(message: Message): void {
        this.worker.postMessage(message);
    }

    private setOnMessageEventHandler(callback: Function): void{
        this.worker.onmessage = (event: MessageEvent): void => {
            const unit = event.data;
            callback(unit);
        };
    }

    async runPondering(ponderingData: PonderingData): Promise<IUnit> {
        const message = this.createMessage(MessageTypes.PONDERING_DATA, ponderingData);
        const ponderingPromise = new Promise<IUnit>(resolve => {
            this.setOnMessageEventHandler(resolve);
            this.sendMessage(message);
        });
        return ponderingPromise;
    }

    terminate(): void {
        this.worker.terminate();
    }
}
