import { Statistics } from '../models/primitives/statistics';
import { ProcessProps } from '@/ui/modules/common/primitives/processProps';
import { RendererOps } from '@/ui/modules/common/renderers/renderer';

export abstract class Runner <T extends ProcessProps> {
    rendererOps: RendererOps;

    constructor(rendererOps: RendererOps) {
        this.rendererOps = rendererOps;
    }

    abstract async run(props: T): Promise<Array<Statistics>>;
}
