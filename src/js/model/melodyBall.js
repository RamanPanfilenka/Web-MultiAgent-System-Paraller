import Ball from "./ball";
import { melodyBallStatus } from "../helpers/melodyBallStatus";

export class MelodyBall extends Ball{
    constructor(id, enviroment, melody, allNotes) {
        super(id, enviroment);
        this.note = null;
        this.timeToNote = 0;
        this.status = 0;
        this.melody = melody;
        this.allNotes;
        this.noteNumber = 0;
    }

    Sensive(worker) {
        const postMessage = {
            ball: this
        };
        worker.postMessage(JSON.stringify(postMessage));
    }

    Pondering(nearestBalls) {
        this.status = melodyBallStatus.Draw;;
        if(note == null){
            this.status = melodyBallStatus.InAgreement;;
            this.note = FindNote(this.melody);
            return;
        }
        const freeNotes = this.GetFreeNotes(nearestBalls);
        nearestBalls.filter(ball => this.note != null && ball.note == this.note).forEach(ball => {
           if(ball.timeToNote < this.timeToNote && ball.id != this.id){
               this.note = FindNote(freeNotes);
               this.status = melodyBallStatus.InAgreement;
           }
        });
    }

    CopyBall(ball){
        super.CopyBall(ball);
        this.note = ball.note;
        this.timeToNote = ball.timeToNote;
        this.status = ball.status;
    }

    GetFreeNotes(nearestBalls){
        const allNotes = this.melody.notes;
        const freeNotes = allNotes.filter(note => !nearestBalls.map(ball => ball.note).includes(note))
        return freeNotes;
    }

    FindNote(melody){
        let minTime;
        let note;
        for(let i = 0; i < melody.notes.length; i++){
            const notePosition = freeNote.position;
            const distanceX = this.Position.X - notePosition.x;
            const distanceY = this.Position.Y - notePosition.x;
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
            const toNoteTime = distance / this.Velocity;
            if((minTime == undefined || toNoteTime < minTime) && minTime < melody.times[i]){
                note = freeNote;
                this.timeToNote = minTime;
            }
        }
        return note;
    }
}