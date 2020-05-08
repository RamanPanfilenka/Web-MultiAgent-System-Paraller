export interface INote {
    tone: string;
    orderNumber: number;
    playTime: number;
    duration: number;
}

export class Note {
    tone: string;
    orderNumber: number;
    playTime: number;
    duration: number;

    constructor(note: INote) {
        this.tone = note.tone;
        this.orderNumber = note.orderNumber;
        this.playTime = note.playTime;
        this.duration = note.duration;
    }

    equals(otherNote: Note): boolean {
        return this.orderNumber == otherNote.orderNumber;
    }
}
