import { Runner } from '../../common/runner/runner';
import { MelodyPlayerProps } from '@/ui/modules/melodyPlayer/primitives/melodyPlayerProps';
import { MelodyBallScheme } from '../models/units/melodyBall';
import { Point } from '../../common/models/primitives/point';
import { MelodyPlayerFactory } from '../factory/melodyPlayerFactory';
import { RendererOps } from '@/ui/modules/common/renderers/renderer';
import { MelodyStatistics } from '../models/primitives/melodyStatistics';

export class MelodyPlayerRunner extends Runner<MelodyPlayerProps> {

    constructor(rendererOps: RendererOps) {
        super(rendererOps);
    }

    async run(props: MelodyPlayerProps) {
        const agentsCount = props.unitNumber;
        const melody = props.melody;
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
        const melodyFactory = new MelodyPlayerFactory();
        const enviroment = melodyFactory.getEnviroment(angentsInitData, this.rendererOps, melody);
        const startTime = Date.now();
        const lastNoteTime = melody.notes[melody.notes.length - 1].playTime;
        while ((Date.now() - startTime) / 600  < lastNoteTime) {
            await enviroment.run();
        }
        return enviroment.getStatistics();
    }
}
