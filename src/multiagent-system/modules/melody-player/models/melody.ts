import { Note, NoteScheme } from './primitives/note';

export class Melody {
    notes: Array<Note>;

    constructor(notesData: Array<NoteScheme>) {
        this.notes = notesData.map(noteData => new Note(noteData));
    }

    removePlayedNotes(currentTime: number) {
        this.notes = this.notes.filter(note => note.playTime < currentTime);
    }
}
