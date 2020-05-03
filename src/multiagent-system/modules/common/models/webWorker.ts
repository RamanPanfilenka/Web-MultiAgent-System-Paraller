import { Message, MessageTypes } from './message';

const globalSelf: Worker = self as any;

export default abstract class WebWorker<T> {
    unit: T;
    nearestUnits: Array<T>;

    constructor() {
        this.initMessageHandler();
    }

    private initMessageHandler() {
        globalSelf.onmessage = (event: MessageEvent) => {
            const message: Message = event.data;
            switch (message.type) {
                case MessageTypes.INITIAL_DATA: {
                    this.setInitialData(message.data);
                    break;
                }

                case MessageTypes.PONDERING_DATA: {
                    const result = this.runPondering(message.data);
                    this.sendResult(result);
                    break;
                }
            }
        };
    }

    protected sendResult(result: T) {
        globalSelf.postMessage(result);
    }

    abstract setInitialData(initialData: any): void

    abstract runPondering(ponderingData: any): T
}