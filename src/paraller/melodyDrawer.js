import { enviroment } from "../enviroment/enviroment";

export class MelodyDrawer{
    constructor(canvans, enviroment){
        this.canvans = canvans;
        this.context = canvans.getContext("2d");
        this.enviroment = enviroment;
    }

    DrawNotes(notes){
        const body =  document.getElementById("body");
        const screenWidth = body.clientWidth;
        const maxNotesInRow = Math.round(screenWidth / this.enviroment.noteWidth) - 1;
        let startWidhtPosition = this.enviroment.noteWidth / 2 ;
        let startHeightPosition = this.enviroment.noteHeight / 2;
        this.context.beginPath();
        const old = this.context.lineWidth;
        this.context.lineWidth = 2;
        let elementsInRow = 0;
        notes.forEach(note => {
            this.context.rect(startWidhtPosition, startHeightPosition, 100, 100);
            note.position.x = startWidhtPosition;
            note.position.y = startHeightPosition;
            elementsInRow++;
            if(maxNotesInRow == elementsInRow){
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