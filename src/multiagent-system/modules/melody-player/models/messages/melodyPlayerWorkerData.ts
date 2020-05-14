import { NoteScheme } from '../primitives/note';
import { PianoKeyScheme } from '../primitives/pianoKey';

export interface MelodyPlayerWorkerData {
    melody: Array<NoteScheme>;
    pianoKeys: Array<PianoKeyScheme>;
}
