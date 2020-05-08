import { WebWorker } from '@mas/modules/common/worker/webWorker';
import { INote } from '../models/primitives/note';
import { IPianoKey } from '../models/primitives/pianoKey';
import { MelodyBall } from '../models/units/melodyBall';
import { PianoKeyboard } from '../models/pianoKeyboard';
import { Melody } from '../models/melody';

export default {} as typeof Worker & (new () => Worker);

interface MelodyPlayerWorkerData {
    melody: Array<INote>;
    pianoKeys: Array<IPianoKey>;
}

class MelodyPlayerWorker extends WebWorker<MelodyBall> {
    melody: Melody;
    pianoKeyboard: PianoKeyboard;
    currentTime: number;

    constructor() {
        super();
    }

    protected initMappers(): void {
        this.mappers.add(MelodyBall);
    }

    setInitialData(initialData: MelodyPlayerWorkerData): void {
        this.melody = new Melody(initialData.melody);
        this.pianoKeyboard = new PianoKeyboard(initialData.pianoKeys);
    }

    runPondering(): void {
        this.melody.removePlayedNotes(this.currentTime);

        if (this.unit.isNotePlayed(this.currentTime)) {
            this.chooseNote();
        }

        this.resolveConflicts();
    }

    private resolveConflicts() {
        this.nearestUnits
            .filter(unit => unit instanceof MelodyBall && this.unit.hasSameTargetNoteWith(unit))
            .forEach((unit: MelodyBall) => {
                if (this.unit.getTimeToNote() > unit.getTimeToNote()) {
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
            const timeToNote = this.unit.getTimeToNote(pianoKey);
            if (timeToNote + this.currentTime <= note.playTime) {
                this.unit.targetNote = note;
                this.unit.targetKey = pianoKey;
                return;
            }
        }
    }
}

new MelodyPlayerWorker();
