import { Factory } from '../../common/factory/factory';
import { Agent } from '../../common/agent/agent';
import { Unit, UnitScheme } from '../../common/models/units/unit';
import { MelodyBall, MelodyBallScheme } from '../models/units/melodyBall';
import MelodyPlayerWorker from '../worker/melodyPlayer.worker';
import { MelodyPlayerWorkerData } from '../models/messages/melodyPlayerWorkerData';
import { PianoKeyScheme, PianoKey } from '../models/primitives/pianoKey';
import { RendererOps, Renderer } from '@/ui/renderer';
import { MelodyRendererOps, MelodyRenderer } from '@/ui/melodyRenderer';
import { PianoPlayer } from '@/ui/pianoPlayer';

export class MelodyPlayerFactory extends Factory {
    blackTones = ['C#', 'D#', 'F#', 'G#', 'A#'];
    whiteTones = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    whiteKeysCount = 50;
    blackKeysCount = 35;
    keyWidht = 75;
    keyHeight = 300;
    blackKeyHeight = this.keyHeight / 2.2;
    blackKeys: Array<PianoKey>;
    whiteKeys: Array<PianoKey>;

    constructor() {
        super();
        this.blackKeys = this.getBlackKeys();
        this.whiteKeys = this.getWhiteKeys();
    }

    protected getAgents(agentsCount: number, agentsInitData: Array<UnitScheme>, initData?: any): Array<Agent> {
        const processInitData = this.getProcessInitData(initData);
        const agents = [...new Array(agentsCount)].map((a, index) => {
            const agentInitData = agentsInitData[index];
            const melodyBall = new MelodyBall(<MelodyBallScheme>agentInitData);
            const worker = new MelodyPlayerWorker();
            const process = this.getProcess(worker, processInitData);
            return new Agent(melodyBall, process);
        });
        return agents;
    }

    protected getProcessInitData(initData: any) {
        const processInitData: MelodyPlayerWorkerData = {
            melody: initData.notes,
            pianoKeys: this.whiteKeys.concat(this.blackKeys),
            startTime: Date.now(),
        };
        return processInitData;
    }

    protected updateRendererOps(rendererOps: RendererOps): MelodyRendererOps {
        const melodyRendererOps = <MelodyRendererOps>rendererOps;
        const pianoPlayer = new PianoPlayer();
        melodyRendererOps.blackKeys = this.blackKeys;
        melodyRendererOps.whiteKeys = this.whiteKeys;
        melodyRendererOps.pianoPlayer = pianoPlayer;
        return melodyRendererOps;
    }

    protected getRenderer(renderOptions: RendererOps): Renderer {
        const updateRendererOps = this.updateRendererOps(renderOptions);
        return new MelodyRenderer(updateRendererOps);
    }

    protected getWhiteKeys() {
        const whiteKeys = this.getPianoKeys(this.whiteKeysCount, this.whiteTones, 0, window.innerHeight / 6, this.whiteKeysAddingWidth);
        return whiteKeys;
    }

    protected getBlackKeys() {
        const blackKeys = this.getPianoKeys(this.blackKeysCount, this.blackTones, this.keyWidht / 1.8, window.innerHeight / 6, this.blackKeysAddingWidth);
        return blackKeys;
    }

    protected getPianoKeys(pianoKeysCount: number, tones: Array<string> , startWidhtPosition: number, startHeightPosition: number, widthAddingFunction: any) {
        const firstWidthPosition = startWidhtPosition;
        let octaves = 1;
        let toneNumber = -1;
        const pianoKeys = [...new Array(pianoKeysCount)].map(() => {
            toneNumber++;
            if (toneNumber == tones.length) {
                toneNumber = 0;
                octaves++;
            }

            const x = startWidhtPosition;
            const y = startHeightPosition;
            const tone = tones[toneNumber] + octaves;
            const pianoKey = this.getPianoKey(x, y, tone);

            startWidhtPosition = widthAddingFunction(startWidhtPosition, this.keyWidht, tone);
            if (startWidhtPosition > window.innerWidth - this.keyWidht * 1.5) {
                startWidhtPosition = firstWidthPosition;
                startHeightPosition += this.keyHeight;
            }
            return pianoKey;
        });
        return pianoKeys;
    }

    protected getPianoKey(x: number, y: number, tone: string) {
        const black = this.isBlack(tone);
        const pianoKeySheme: PianoKeyScheme = {
            size: 20,
            centerPoint : {
                x: x + this.keyWidht / 2,
                y: black
                    ? y + 5 + this.blackKeyHeight / 2
                    : y + this.keyHeight / 2,
            },         //Not perfect sprites =(
            tone: tone,
            width: black
                ? this.keyWidht - 10
                : this.keyWidht,
            height: black
                ? this.blackKeyHeight
                : this.keyHeight,
            isPressed: false,
        };
        const note = new PianoKey(pianoKeySheme);
        return note;
    }

    protected isBlack(tone: string) {
        return tone.includes('#');
    }

    protected whiteKeysAddingWidth(startWidhtPosition: number, keyWidht: number ,tone: string): any {
        startWidhtPosition += keyWidht;
        return startWidhtPosition;
    }

    protected blackKeysAddingWidth(startWidhtPosition: number, keyWidht: number, tone: string) {
        const skipNext = tone.includes('D') || tone.includes('A');
        startWidhtPosition += skipNext
            ? keyWidht * 2
            : keyWidht;
        return startWidhtPosition;
    }
}
