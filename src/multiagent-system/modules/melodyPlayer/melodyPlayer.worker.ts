import Note from './models/note';
import AgentWorker from '../common/agentWorker';
import PianoKey from './models/pianoKey';
import Point from '../common/models/point';
import Message from '../common/models/message';
import MelodyBall from './models/units/melodyBall';

export default {} as typeof Worker & (new () => Worker);

class MelodyPlayerWorker extends AgentWorker<MelodyBall> {
    melody: Array<Note>;
    currentTime: number;
    melodyBall: MelodyBall;
    nearestBalls: Array<MelodyBall>;
    pianoKeys: Array<PianoKey>;


    // constructor(melody: Array<Note>, pianoKeys: Array<PianoKey>) {
    //     super();
    //     this.melody = melody;
    //     this.pianoKeys = pianoKeys;
    // }

    constructor() {
        super();
    }

    pondering(): MelodyBall {
        if (this.melodyBall.note) {
            this.chooseNote();
        }

        if (this.isInKey() && this.currentTime > this.melodyBall.note.playTime) {
            this.chooseNote();
        }

        this.nearestBalls.filter(ball => this.isSameDestinationPoint(ball.destinationPoint)).forEach(ball => {
            if (this.melodyBall.getTimeToNote() > ball.getTimeToNote()) {
                this.chooseNote();
            }
        });

        return this.melodyBall;
    }

    private isSameDestinationPoint(otherBallPoint: Point): boolean {
        return this.melodyBall.destinationPoint.equals(otherBallPoint);
    }

    private isInKey(): boolean {
        const destinationPoint = this.melodyBall.destinationPoint;
        const distance = this.melodyBall.position.getDistanceTo(destinationPoint).value;

        return distance < 30;
    }

    private chooseNote(): void {
        const notes = this.getAvailableNotes();
        notes.forEach(note =>{
            const pianoKey = this.getPianoKey(note.tone);
            const timeToNote = this.melodyBall.getTimeToNote(pianoKey.position);
            if (timeToNote + this.currentTime <= note.playTime) {
                this.melodyBall.note = note;
                this.melodyBall.destinationPoint = pianoKey.position;

                return;
            }
        });
    }

    private getAvailableNotes() {
        const destinationNote = this.melodyBall.note;
        const availableNotes = destinationNote
            ? this.melody.filter(note => note.playTime > this.currentTime)
            : this.melody.filter(note => note.playTime > this.currentTime && note.orderNumber != destinationNote.orderNumber);

        return availableNotes;
    }

    private getPianoKey(tone: string) {
        return this.pianoKeys.find(key => key.tone == tone);
    }
}

new MelodyPlayerWorker();