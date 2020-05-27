import { UiRenderer } from '../renderers/uiRenderer';
import { Runner } from '@/multiagent-system/modules/common/runner/runner';
import { ProcessProps } from './processProps';

export interface ModuleData<T extends ProcessProps> {
    uiRenderer: UiRenderer;
    onRun: any;
    runner: Runner<T>;
}
