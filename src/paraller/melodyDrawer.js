import { enviroment } from "../enviroment/enviroment";

export class MelodyDrawer{
    constructor(canvans, enviroment, melody){
        this.canvans = canvans;
        this.context = canvans.getContext("2d");
        this.enviroment = enviroment;
        this.melody = melody;
    }

    DrawNotes(notes, currentTime){
        this.context.beginPath();
        const old = this.context.lineWidth;
        this.context.lineWidth = 2;
        notes.forEach(note => {
            const melodyNote = this.melody.notes.find(elem => {
                if(elem != undefined){
                    return elem.noteId == note.id && (currentTime < elem.time + 0.2 && currentTime > elem.time - 0.05)
                }
            });
            if(currentTime != undefined && melodyNote != undefined){
                this.context.fillStyle = `rgb(255,255,204)`;
                this.context.fillRect(note.position.x - this.enviroment.noteWidth / 2 , note.position.y - this.enviroment.noteHeight / 2,  this.enviroment.noteWidth, this.enviroment.noteHeight);
                this.context.fillStyle = `black`;
            }else{
                this.context.rect(note.position.x - this.enviroment.noteWidth / 2, note.position.y - this.enviroment.noteHeight / 2,  this.enviroment.noteWidth, this.enviroment.noteHeight);
            }
        });
        this.context.lineWidth = old;
        this.context.stroke();
        return notes;
    }

}