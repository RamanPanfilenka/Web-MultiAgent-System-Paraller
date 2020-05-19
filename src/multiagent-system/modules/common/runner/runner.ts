import { Statistics } from '../models/primitives/statistics';
import { ProcessProps } from '@/ui/modules/common/primitives/processProps';
import { RendererOps, Renderer } from '@/ui/modules/common/renderers/renderer';
import { AgentsEnvironment } from '../environment/agentsEnvironment';
import { Factory } from '../factory/factory';

export abstract class Runner <T extends ProcessProps> {
    enviroment: AgentsEnvironment;
    factory: Factory;

    async run(): Promise<Array<Statistics>> {
        const renderer = this.factory.getRenderer();
        renderer.init(this.enviroment.agents);
        while (this.stopPredicate()) {
            const agents = await this.enviroment.run();
            renderer.render(agents);
        }
        const statistics = this.enviroment.getStatistics();
        this.enviroment.terminate();
        return statistics;
    }

    abstract setUp(props: T): void;

    abstract stopPredicate(): boolean;
}
