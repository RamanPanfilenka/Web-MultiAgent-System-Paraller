import * as Tone from 'tone';


export class PianoPlayer {
    synth: Tone.PolySynth;
    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth,{
            envelope : {
                attack : 0.02,
                decay : 0.1,
                sustain : 0.3,
                release : 1,
            },
        }).toMaster();
        this.synth.maxPolyphony = 20;
    }

    play(tone: string, duration: number): void{
        this.synth.triggerAttackRelease(tone, duration);
    }
}
