import { enviroment } from '@/enviroment/enviroment';

export class MelodyDrawer {
    constructor(canvans, enviroment, melody) {
        this.canvans = canvans;
        this.context = canvans.getContext('2d');
        this.enviroment = enviroment;
        this.melody = melody;
    }

    DrawNotes(notes, currentTime) {
        const screenWidth = enviroment.width;
        const maxNotesInRow = Math.round(screenWidth / this.enviroment.noteWidth) - 1;
        let startWidhtPosition = this.enviroment.noteWidth / 2 ;
        let startHeightPosition = this.enviroment.noteHeight / 2;
        this.context.beginPath();
        const old = this.context.lineWidth;
        this.context.lineWidth = 2;
        let elementsInRow = 0;
        notes.forEach(note => {
            const melodyNote = this.melody.notes.find(elem => {
                if (elem != undefined) {
                    return elem.noteId == note.id;
                }
            });
            if (currentTime != undefined && melodyNote != undefined && (currentTime < melodyNote.time + 0.2 && currentTime > melodyNote.time - 0.05)) {
                this.context.fillStyle = 'rgb(255,255,204)';
                this.context.fillRect(startWidhtPosition, startHeightPosition, 200, 200);
                this.context.fillStyle = 'black';
            } else {
                this.context.rect(startWidhtPosition, startHeightPosition, 200, 200);
            }

            note.position.x = startWidhtPosition + 50;
            note.position.y = startHeightPosition + 50;
            elementsInRow++;
            if (maxNotesInRow == elementsInRow) {
                elementsInRow = 0;
                startHeightPosition += this.enviroment.noteHeight;
                startWidhtPosition = this.enviroment.noteWidth / 2;

                return;
            }
            startWidhtPosition += this.enviroment.noteWidth;

        });
        this.context.lineWidth = old;
        this.context.stroke();

        return notes;
    }

}