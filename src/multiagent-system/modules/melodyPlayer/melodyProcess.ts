import Note from "./models/note";
import Process from "../common/Process";
import PianoKey from "./models/pianoKey";
import Point from "../common/models/point";
import Message from "../common/models/message";
import MelodyBall from "./models/units/melodyBall";

export default class MelodyProcess extends Process{
    melody : Array<Note>;
    currentTime : number;
    melodyBall : MelodyBall;
    nearestBalls : Array<MelodyBall>;
    pianoKeys : Array<PianoKey>;


    constructor(melody : Array<Note>, pianoKeys : Array<PianoKey>){
        super();
        this.melody = melody;
        this.pianoKeys = pianoKeys;
    }   

    pondering() : string{
        if (this.melodyBall.note == null) {
            this.chooseNote();
        }

        if (this.isInKey() && this.currentTime > this.melodyBall.note.playTime) {
            this.chooseNote();
        }
        
        this.nearestBalls.filter(ball => this.isSameDestinationPoint(ball.destinationPoint)).forEach(ball => {
            if (this.melodyBall.getTimeToNote() > ball.getTimeToNote()) {
                this.chooseNote();
            }
        });

        return this.getAnswerMessage();
    }

    protected parseMessage(msg: string): void {
        const model : Message<MelodyBall> = JSON.parse(msg);
        this.melodyBall = model.unit;
        this.nearestBalls = model.nearestUnits;
        this.currentTime = model.currentTime;
    }
    
    private isSameDestinationPoint(otherBallPoint : Point) : boolean{
        return this.melodyBall.destinationPoint.equals(otherBallPoint);
    }

    private isInKey() : boolean {
        const destinationPoint = this.melodyBall.destinationPoint;
        const distance = this.melodyBall.position.getDistanceTo(destinationPoint).value;
        return distance < 30;
    }

    private chooseNote() : void {
        const notes = this.getAvailableNotes();
        notes.forEach(note =>{
            const pianoKey = this.getPianoKey(note.tone);
            const timeToNote = this.melodyBall.getTimeToNote(pianoKey.position);
            if(timeToNote + this.currentTime <= note.playTime){
                this.melodyBall.note = note;
                this.melodyBall.destinationPoint = pianoKey.position;
                return;
            }
        });
    }

    private getAvailableNotes(){
        const destinationNote = this.melodyBall.note
        return destinationNote == null 
                ? this.melody.filter(note => note.playTime > this.currentTime)
                : this.melody.filter(note => note.playTime > this.currentTime && note.orderNumber != destinationNote.orderNumber);
    }

    private getPianoKey(tone : string){
        return this.pianoKeys.find(key => key.tone == tone);
    }

    private getAnswerMessage() : string{
        const message : Message<MelodyBall> = {
            unit : this.melodyBall,
        };
        return JSON.stringify(message);
    }
}