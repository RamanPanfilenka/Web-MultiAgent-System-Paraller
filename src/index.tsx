import '../node_modules/normalize.css/normalize.css';
import '../node_modules/@blueprintjs/core/lib/css/blueprint.css';
import './ui/asserts/css/style.css';

import $ from 'jquery';
import { MelodyPlayerProps } from './ui/modules/melodyPlayer/primitives/melodyPlayerProps';
import { MelodyUiRederer } from './ui/modules/melodyPlayer/renderers/melodyUiRederer';
import { onMelodyPlayerRun } from './ui/modules/melodyPlayer/melodyPlayer.onRun';
import { MelodyPlayerRunner } from './multiagent-system/modules/melody-player/runner/melodyPlayerRunner';
import { Statistics } from './multiagent-system/modules/common/models/primitives/statistics';
import { ProcessProps } from './ui/modules/common/primitives/processProps';
import { ModuleData } from './ui/modules/common/primitives/moduleData';
import { RendererOps } from './ui/modules/common/renderers/renderer';
import { MelodyStatistics } from './multiagent-system/modules/melody-player/models/primitives/melodyStatistics';

function getRenderOps() {
    const backgroundColor = 0xffffff;
    const canvans =  $('#view')[0];
    const rendererOps: RendererOps = {
        canvans: canvans,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: backgroundColor,
    };
    return rendererOps;
}

function getModuleData(type: string): ModuleData<ProcessProps> {
    const melodyModuleData: ModuleData<MelodyPlayerProps> = {
        uiRenderer: new MelodyUiRederer(),
        onRun: onMelodyPlayerRun,
        runner: new MelodyPlayerRunner(getRenderOps()),
    };
    return melodyModuleData;
}

function run(type: string) {
    const data = getModuleData(type);
    data.uiRenderer.render();
    data.uiRenderer.subscribe(() => {
        data.onRun(data.runner, (statistics: Array<Statistics>) => {
            data.uiRenderer.renderStatistics(statistics);
        });
    });
}

$(document).ready(() => {
    run('');
});



