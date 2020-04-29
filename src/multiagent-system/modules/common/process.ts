export default abstract class Process{
    constructor(){
        this.initMessageHandler();
    }

    private initMessageHandler(){
        self.onmessage = (msg : any) => {
            this.parseMessage(msg);
            this.pondering();
        };
    }

    protected sensive(msg : JSON, targerOptions : string = '*') {
        self.postMessage(msg, targerOptions);
    }
    
    abstract pondering() : JSON;

    abstract parseMessage(msg : string) : void;
}