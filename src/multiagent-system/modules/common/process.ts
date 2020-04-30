export default abstract class Process{
    constructor(){
        this.initMessageHandler();
    }

    private initMessageHandler(){
        self.onmessage = (msg : any) => {
            this.parseMessage(msg);
            const message = this.pondering();
            this.sensive(message);
        };
    }

    protected sensive(msg : string, targerOptions : string = '*') {
        self.postMessage(msg, targerOptions);
    }
    
    protected abstract pondering() : string

    protected abstract parseMessage(msg : string) : void;
}