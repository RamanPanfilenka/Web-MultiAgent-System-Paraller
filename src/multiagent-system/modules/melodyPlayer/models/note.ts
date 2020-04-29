export default class Note {
    tone: string;
    orderNumber: number;
    playTime: number;
    duration: number;

    constructor(
        tone: string,
        orderNumber: number,
        playTime: number,
        duration: number,
    ) {
        this.tone = tone;
        this.orderNumber = orderNumber;
        this.playTime = playTime;
        this.duration = duration;
    }
}