import Ball from "./ball";
import { melodyBallStatus } from "../helpers/melodyBallStatus";
import { enviroment } from "../../enviroment/enviroment";

export class MelodyBall extends Ball{
    constructor(id, enviroment, melody, allNotes) {
        super(id, enviroment);
        this.note = null;
        this.timeToNote = 0;
        this.status = 0;
        this.melody = melody;
        this.noteNumber = 0;
        this.allNotes = allNotes;
        this.currentTime = 0;
        this.checkNearest = false;
        this.notePlayTime = 0;
    }

    Sensive(worker) {
        const postMessage = {
            ball: this
        };
        worker.postMessage(JSON.stringify(postMessage));
    }

    Pondering() {
        this.status = melodyBallStatus.Draw;
        if(this.note == undefined && this.noteNumber == 0){
            this.status = melodyBallStatus.InAgreement;
            this.note = this.FindNote(this.melody);
            return;
        }

        const freeNotes = {
            notes : this.GetFreeNotes(this.nearestBalls),
            times : this.melody.times
        };
        if(this.checkNearest){
            this.nearestBalls.filter(ball => this.note != undefined && ball.noteNumber == this.noteNumber).forEach(ball => {
                const currentdx = this.Position.X - this.note.position.x;
                const currentdy = this.Position.Y - this.note.position.y;
                const balldx = ball.Position.X - this.note.position.x;
                const balldy = ball.Position.Y - this.note.position.y;
                const curentDistance = Math.sqrt(currentdx ** 2 + currentdy ** 2);
                const ballDistance = Math.sqrt(balldx ** 2 + balldy ** 2);
                if(this.timeToNote > ball.timeToNote){
                    this.note = this.FindNote(freeNotes);
                    this.status = melodyBallStatus.InAgreement;
                }
            });
        }
        
        if(this.IsInNote(this.note.position) && this.currentTime > this.notePlayTime){
            this.status = melodyBallStatus.InAgreement;
            const newNote = this.FindNote(this.melody);
            if(newNote != undefined){
                this.note = newNote;
            }else{
                this.status = melodyBallStatus.Stop;
            }
        }
    }

    IsInNote(notePosition){
        return (Math.abs(this.Position.X - notePosition.x) < 30
                && Math.abs(this.Position.Y - notePosition.y) < 30) 
    }

    CopyBall(ball){
        super.CopyBall(ball);
        this.note = ball.note;
        this.timeToNote = ball.timeToNote;
        this.status = ball.status;
        this.noteNumber = ball.noteNumber;
        this.currentTime = ball.currentTime;
        this.checkNearest = ball.checkNearest;
        this.notePlayTime = ball.notePlayTime;
    }

    GetFreeNotes(nearestBalls){
        const allMelodyNotes = this.melody.notes.filter(note => note != null || note != undefined);
        const selectedNoteIds = nearestBalls.map(ball => ball.note.id);
        const freeNotes = allMelodyNotes.filter(note => !selectedNoteIds.includes(note.noteId));
        return freeNotes;
    }

    FindNote(melody){
        this.Velocity = enviroment.defaultVelocity;
        for(let i = 0; i < melody.notes.length; i++){
            if(melody.notes[i]){
                const noteId = melody.notes[i].noteId;
                const currentNote = this.GetNoteById(noteId);
                const notePosition = currentNote.position;
                const distanceX = this.Position.X - notePosition.x;
                const distanceY = this.Position.Y - notePosition.y;
                const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
                const toNoteTime = distance / this.Velocity/ 1000;
                if(toNoteTime + this.currentTime < melody.notes[i].time){
                    this.notePlayTime = melody.notes[i].time;
                    this.timeToNote = toNoteTime;
                    this.noteNumber = melody.notes[i].orderNumber;
                    const newVelocity = distance/(melody.notes[i].time - this.currentTime);
                    this.Velocity = newVelocity / 360;
                    return currentNote;
                }
            }
        }
    }

    GetNoteById(id){
        return this.allNotes.find(note => note.id == id);
    }
}