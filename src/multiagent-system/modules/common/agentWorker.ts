const globalSelf: Worker = self as any;

export default abstract class AgentWorker<T> {
    currentUnit: T;
    nearestUnits: Array<T>;

    constructor() {
        this.initMessageHandler();
    }

    private initMessageHandler() {
        globalSelf.onmessage = (event: MessageEvent) => {
            const result = event.data;
            console.log('Catch data inside worker');
            this.sendResult(result);
        };
    }

    protected sendResult(result: T) {
        globalSelf.postMessage(result);
    }

    abstract pondering(): T
}