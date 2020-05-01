export default abstract class Process{
    constructor(){
        this.initMessageHandler();
    }

    private initMessageHandler(){
        self.onmessage = (event : any) => {
            this.parseMessage(event.data);
            const msg = this.pondering();
            this.sensive(msg);
        };
    }

    protected sensive(msg : string) {
        self.postMessage(msg, null);
    }
    
    protected abstract pondering() : string

    protected abstract parseMessage(msg : string) : void;
}