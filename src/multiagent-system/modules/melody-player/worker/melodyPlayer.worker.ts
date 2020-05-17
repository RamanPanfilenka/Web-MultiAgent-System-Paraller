import { WebWorker } from '@mas/modules/common/worker/webWorker';
import { MelodyBall } from '../models/units/melodyBall';
import { PianoKeyboard } from '../models/pianoKeyboard';
import { Melody } from '../models/melody';
import { MelodyPlayerWorkerData } from '../models/messages/melodyPlayerWorkerData';
import { PianoKey } from '../models/primitives/pianoKey';

export default {} as typeof Worker & (new () => Worker);

class MelodyPlayerWorker extends WebWorker<MelodyBall> {
    melody: Melody;
    pianoKeyboard: PianoKeyboard;
    currentTime: number;
    startTime: number;

    constructor() {
        super();
    }

    protected initMappers(): void {
        this.mappers.add(MelodyBall);
    }

    setInitialData(initialData: MelodyPlayerWorkerData): void {
        this.melody = new Melody(initialData.melody);
        this.pianoKeyboard = new PianoKeyboard(initialData.pianoKeys);
        this.startTime = initialData.startTime;
    }

    runPondering(): void {
        this.updateTime();
        this.melody.removePlayedNotes(this.currentTime);

        if (this.unit.targetNote &&  this.unit.targetNote.playTime - this.currentTime < 0.05) {   //Bad
            this.unit.targetKey.isPressed = true;
        }

        if (this.unit.isNotePlayed(this.currentTime) || !this.unit.targetNote) {
            this.unit.resetTargetNote();
            this.chooseNote();
        }

        this.resolveConflicts();

        if (!this.unit.isInKey()) {
            this.move();
        }
    }

    private updateTime() {
        this.currentTime = (Date.now() - this.startTime) / 600;
    }

    private resolveConflicts() {
        this.nearestUnits
            .filter(unit => unit instanceof MelodyBall && this.unit.hasSameTargetNoteWith(unit))
            .forEach((unit: MelodyBall) => {
                if (this.unit.getTimeToNote() > unit.getTimeToNote()
                    || (this.unit.getTimeToNote() == unit.getTimeToNote() && this.unit.id > unit.id)) {

                    this.chooseNote();
                }
            });
    }

    private chooseNote(): void {
        for (const note of this.melody.notes) {
            if (this.unit.targetNote && this.unit.targetNote.equals(note)) {
                continue;
            }
            const pianoKey = this.pianoKeyboard.keys.get(note.tone);
            if (this.isSomeUnitOnPianoKey(pianoKey)) {
                continue;
            }
            const timeToNote = this.unit.getTimeToNote(pianoKey);
            if (timeToNote + this.currentTime <= note.playTime) {
                this.unit.targetNote = note;
                this.unit.targetKey = pianoKey;
                break;
            }
        }
    }

    private isSomeUnitOnPianoKey(pianoKey: PianoKey): boolean {
        const unitsInKey = this.nearestUnits.find(unit => unit instanceof MelodyBall && unit.isInKey(pianoKey));
        return unitsInKey != undefined;
    }

    private move() {
        this.correctDirection();
        this.step();
    }

    private correctDirection() {
        const pianoKeyPosition = this.pianoKeyboard.keys.get(this.unit.targetNote.tone).centerPoint;
        const unitPosition = this.unit.position;
        const dx = unitPosition.x - pianoKeyPosition.x;
        const dy = unitPosition.y - pianoKeyPosition.y;
        const angle = Math.atan2(dy, dx);
        this.unit.speed.angle = angle;
    }

    protected step() {
        this.unit.position.x += this.unit.speed.x;
        this.unit.position.y += this.unit.speed.y;
    }

    protected changeAngle() {
        this.unit.speed.angle = Math.atan(this.unit.speed.y / this.unit.speed.x);
    }

}

new MelodyPlayerWorker();
