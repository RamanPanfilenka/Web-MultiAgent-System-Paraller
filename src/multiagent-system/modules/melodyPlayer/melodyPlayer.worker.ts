import WebWorker from '@mas/modules/common/models/webWorker';
import Point from '@mas/modules/common/models/point';
import Note from './models/note';
import PianoKey from './models/pianoKey';
import MelodyBall from './models/units/melodyBall';
import PonderingData from '../common/models/ponderingData';

export default {} as typeof Worker & (new () => Worker);

class MelodyPlayerWorker extends WebWorker<MelodyBall> {
    melody: Array<Note>;
    currentTime: number;
    pianoKeys: Array<PianoKey>;

    constructor() {
        super();
    }

    setInitialData(initialData: any): void {
        this.melody = initialData.melody;
        this.pianoKeys = initialData.pianoKeys;
    }

    runPondering(ponderingData: any): MelodyBall {
        if (this.unit.note) {
            this.chooseNote();
        }

        if (this.isInKey() && this.currentTime > this.unit.note.playTime) {
            this.chooseNote();
        }

        const conflictingUnits = this.nearestUnits.filter(unit => this.isSameDestinationPoint(unit.destinationPoint));
        conflictingUnits.forEach(unit => {
            if (this.unit.getTimeToNote() > unit.getTimeToNote()) {
                this.chooseNote();
            }
        });

        return this.unit;
    }

    private isSameDestinationPoint(otherBallPoint: Point): boolean {
        return this.unit.destinationPoint.equals(otherBallPoint);
    }

    private isInKey(): boolean {
        const destinationPoint = this.unit.destinationPoint;
        const distance = this.unit.position.getDistanceTo(destinationPoint).value;

        return distance < 30;
    }

    private chooseNote(): void {
        const notes = this.getAvailableNotes();
        notes.forEach(note =>{
            const pianoKey = this.getPianoKey(note.tone);
            const timeToNote = this.unit.getTimeToNote(pianoKey.position);
            if (timeToNote + this.currentTime <= note.playTime) {
                this.unit.note = note;
                this.unit.destinationPoint = pianoKey.position;

                return;
            }
        });
    }

    private getAvailableNotes() {
        const destinationNote = this.unit.note;
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