import { Midi } from '@tonejs/midi';
import { Melody } from '../../../../multiagent-system/modules/melody-player/models/melody';

export function getMelody(midi: Midi) {
    const track = midi.tracks[0];
    const trackNotes = track.notes;
    const notes = [...new Array(track.notes.length)].map((a, index)=>{
        return {
            orderNumber: index + 1,
            tone: trackNotes[index].name,
            duration: trackNotes[index].duration,
            playTime: trackNotes[index].time + 4,
        };
    });
    return new Melody(notes);
}

export function parseMidi(midi: File, callback: any) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const result = e.target.result as ArrayBuffer;
        const midi = new Midi(result);
        const melody = getMelody(midi);
        callback(melody);
    };
    reader.readAsArrayBuffer(midi);
}

