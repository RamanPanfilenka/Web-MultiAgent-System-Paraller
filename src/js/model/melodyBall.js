import config from '@/config';
import Ball from './ball';
import { melodyBallStatus } from '../helpers/melodyBallStatus';

export class MelodyBall extends Ball {
    constructor(id, melody, notes) {
        super(id);
        this.note = null;
        this.timeToNote = 0;
        this.status = 0;
        this.melody = melody;
        this.noteNumber = 0;
        this.notes = notes;
        this.currentTime = 0;
        this.checkNearest = false;
        this.notePlayTime = 0;
    }

    sensive(worker) {
        const postMessage = {
            ball: this,
        };
        worker.postMessage(JSON.stringify(postMessage));
    }

    pondering() {
        this.status = melodyBallStatus.DRAW;
        if (this.note == undefined && this.noteNumber == 0) {
            this.status = melodyBallStatus.IN_AGREEMENT;
            this.note = this.findNote(this.melody);

            return;
        }

        const freeNotes = {
            notes : this.getFreeNotes(this.nearestBalls),
            times : this.melody.times,
        };
        if (this.checkNearest) {
            this.nearestBalls.filter(ball => this.note != undefined && ball.noteNumber == this.noteNumber).forEach(ball => {
                if (this.timeToNote > ball.timeToNote) {
                    this.note = this.findNote(freeNotes);
                    this.status = melodyBallStatus.IN_AGREEMENT;
                }
            });
        }

        if (this.isInNote(this.note.position) && this.currentTime > this.notePlayTime) {
            this.status = melodyBallStatus.IN_AGREEMENT;
            const newNote = this.findNote(this.melody);
            if (newNote != undefined) {
                this.note = newNote;
            } else {
                this.status = melodyBallStatus.STOP;
            }
        }
    }

    isInNote(notePosition) {
        return (Math.abs(this.position.x - notePosition.x) < 30
                && Math.abs(this.position.y - notePosition.y) < 30);
    }

    copyBall(ball) {
        super.copyBall(ball);
        this.note = ball.note;
        this.timeToNote = ball.timeToNote;
        this.status = ball.status;
        this.noteNumber = ball.noteNumber;
        this.currentTime = ball.currentTime;
        this.checkNearest = ball.checkNearest;
        this.notePlayTime = ball.notePlayTime;
    }

    getFreeNotes(nearestBalls) {
        const allMelodyNotes = this.melody.notes.filter(note => note != null || note != undefined);
        const selectedNoteIds = nearestBalls.map(ball => ball.note.id);
        const freeNotes = allMelodyNotes.filter(note => !selectedNoteIds.includes(note.noteId));

        return freeNotes;
    }

    findNote(melody) {
        this.velocity = config.defaultVelocity;
        for (let i = 0; i < melody.notes.length; i++) {
            if (melody.notes[i]) {
                const noteId = melody.notes[i].noteId;
                const currentNote = this.getNoteById(noteId);
                const notePosition = currentNote.position;
                const distanceX = this.position.x - notePosition.x;
                const distanceY = this.position.y - notePosition.y;
                const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
                const toNoteTime = distance / this.velocity/ 1000;
                if (toNoteTime + this.currentTime < melody.notes[i].time) {
                    this.notePlayTime = melody.notes[i].time;
                    this.timeToNote = toNoteTime;
                    this.noteNumber = melody.notes[i].orderNumber;
                    const newVelocity = distance/(melody.notes[i].time - this.currentTime);
                    this.velocity = newVelocity / 400;
                    return currentNote;
                }
            }
        }
    }

    getNoteById(id) {
        return this.notes.find(note => note.id == id);
    }
}