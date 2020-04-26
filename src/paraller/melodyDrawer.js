import config from '@/config';

export class MelodyDrawer {
    constructor(canvas, melody) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.melody = melody;
    }

    DrawNotes(notes, currentTime){
        this.context.beginPath();
        const old = this.context.lineWidth;
        this.context.lineWidth = 2;
        notes.forEach(note => {
            const melodyNote = this.melody.notes.find(elem => {
                if (elem != undefined) {
                    return elem.noteId == note.id;
                }
            });
            if(currentTime != undefined && melodyNote != undefined && (currentTime < melodyNote.time + 0.2 && currentTime > melodyNote.time - 0.05)){
                this.context.fillStyle = `rgb(255,255,204)`;
                this.context.fillRect(note.position.x - config.noteWidth / 2 , note.position.y - config.noteHeight / 2, config.noteWidth, config.noteHeight);
                this.context.fillStyle = `black`;
            }else{
                this.context.rect(note.position.x - config.noteWidth / 2, note.position.y - config.noteHeight / 2, config.noteWidth, config.noteHeight);
            }
        });
        this.context.lineWidth = old;
        this.context.stroke();

        return notes;
    }
}