import { AgentsEnvironment } from '../environment/agentsEnvironment';
import { Agent } from '../agent/agent';
import { Process } from '../agent/process';
import { Unit, UnitScheme } from '../models/units/unit';
import { RendererOps, Renderer } from '@/ui/modules/common/renderers/renderer';

export abstract class Factory {
    getEnviroment(agentsInitData: Array<UnitScheme>, renderOptions: RendererOps, initData?: any): AgentsEnvironment {
        const renderer = this.getRenderer(renderOptions);
        const agents = this.getAgents(agentsInitData.length, agentsInitData, initData);
        const agentsEnvironment = this.getEnviromentInstance(agents, renderer);
        return agentsEnvironment;
    }

    protected getEnviromentInstance(agents: Array<Agent>, renderer: Renderer): AgentsEnvironment {
        return new AgentsEnvironment(agents, renderer);
    }

    protected getRenderer(renderOptions: RendererOps): Renderer {
        return new Renderer(renderOptions);
    }

    protected getProcess(worker: Worker, workerInitData?: any): Process {
        return new Process(worker, workerInitData);
    }

    protected abstract getAgents(agentsCount: number, agentsInitData: Array<any>, initData?: any): Array<Agent>;
}
