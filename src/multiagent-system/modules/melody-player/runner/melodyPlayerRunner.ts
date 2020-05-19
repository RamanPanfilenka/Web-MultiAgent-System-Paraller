import { Runner } from '../../common/runner/runner';
import { MelodyPlayerProps } from '@/ui/modules/melodyPlayer/primitives/melodyPlayerProps';
import { MelodyBallScheme } from '../models/units/melodyBall';
import { Point } from '../../common/models/primitives/point';
import { MelodyPlayerFactory } from '../factory/melodyPlayerFactory';
import { RendererOps } from '@/ui/modules/common/renderers/renderer';
import { MelodyStatistics } from '../models/primitives/melodyStatistics';
import { Melody } from '../models/melody';

export class MelodyPlayerRunner extends Runner<MelodyPlayerProps> {
    lastNoteTime = 0;
    startTime = 0;

    constructor(renderOps: RendererOps) {
        super();
        this.factory = new MelodyPlayerFactory(renderOps);
    }

    setUp(props: MelodyPlayerProps) {
        const agentsCount = props.unitNumber;
        const melody = props.melody;
        this.lastNoteTime = melody.notes[melody.notes.length - 1].playTime;
        this.startTime = Date.now();
        const angentsInitData = [...new Array(agentsCount)].map((a, index) =>{
            const position = new Point({x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight});
            const statistics: MelodyStatistics = {
                distanceTraveled : 0,
                playedNotesPercent: 0,
            };
            const melodyBallInitData: MelodyBallScheme = {
                id: index,
                speed: {
                    value: props.unitSpeed,
                    angle: 0,
                },
                position: position,
                connectionRange: 1000,
                radius: 10,
                width: 40,
                height: 40,
                textureUrl: props.ballTexture,
                statistics: statistics,
            };
            return melodyBallInitData;
        });
        this.enviroment = this.factory.getEnviroment(angentsInitData, melody);
    }

    stopPredicate(): boolean {
        if ((Date.now() - this.startTime) / 600 > this.lastNoteTime) {
            return false;
        }
        return true;
    }
}
