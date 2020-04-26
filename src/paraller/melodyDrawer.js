import config from '@/config';

export class MelodyDrawer {
    constructor(canvas, environment, melody) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.environment = environment;
        this.melody = melody;
    }

    DrawNotes(notes, currentTime) {
        const screenWidth = config.width;
        const maxNotesInRow = Math.round(screenWidth / this.environment.noteWidth) - 1;
        let startWidthPosition = this.environment.noteWidth / 2 ;
        let startHeightPosition = this.environment.noteHeight / 2;
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
                this.context.fillRect(startWidthPosition, startHeightPosition, 200, 200);
                this.context.fillStyle = 'black';
            } else {
                this.context.rect(startWidthPosition, startHeightPosition, 200, 200);
            }

            note.position.x = startWidthPosition + 50;
            note.position.y = startHeightPosition + 50;
            elementsInRow++;
            if (maxNotesInRow == elementsInRow) {
                elementsInRow = 0;
                startHeightPosition += this.environment.noteHeight;
                startWidthPosition = this.environment.noteWidth / 2;

                return;
            }
            startWidthPosition += this.environment.noteWidth;

        });
        this.context.lineWidth = old;
        this.context.stroke();

        return notes;
    }
}