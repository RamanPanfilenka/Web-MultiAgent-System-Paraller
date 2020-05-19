import { AgentsEnvironment } from '../environment/agentsEnvironment';
import { Agent } from '../agent/agent';
import { Process } from '../agent/process';
import { Unit, UnitScheme } from '../models/units/unit';
import { RendererOps, Renderer } from '@/ui/modules/common/renderers/renderer';

export abstract class Factory {
    renderOps: RendererOps;

    constructor(renderOps: RendererOps) {
        this.renderOps = renderOps;
    }

    getEnviroment(agentsInitData: Array<UnitScheme>, initData?: any): AgentsEnvironment {
        const agents = this.getAgents(agentsInitData.length, agentsInitData, initData);
        const agentsEnvironment = this.getEnviromentInstance(agents);
        return agentsEnvironment;
    }

    protected getEnviromentInstance(agents: Array<Agent>): AgentsEnvironment {
        return new AgentsEnvironment(agents);
    }

    public getRenderer(): Renderer {
        return new Renderer(this.renderOps);
    }

    protected getProcess(worker: Worker, workerInitData?: any): Process {
        return new Process(worker, workerInitData);
    }

    protected abstract getAgents(agentsCount: number, agentsInitData: Array<any>, initData?: any): Array<Agent>;
}
