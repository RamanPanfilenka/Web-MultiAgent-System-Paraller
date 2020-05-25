import $ from 'jquery';
import { parseMidi } from './utils/midiParser';
import { Melody } from '@/multiagent-system/modules/melody-player/models/melody';
import { MelodyPlayerProps } from './primitives/melodyPlayerProps';
import { Runner } from '@/multiagent-system/modules/common/runner/runner';
import { ProcessProps } from '../common/primitives/processProps';
import { RendererOps } from '../common/renderers/renderer';


function showCanvans() {
    $('.settings ').hide();
    $('#view').show();
}

function getProps(melody: Melody) {
    const ballTextureUrl = require('@/ui/asserts/img/ball.png').default;
    const unitNumber = Number($('#unit-count').val());
    const speed = Number($('#speed').val());
    const connectionRange = Number($('#connection-range'));
    const props: MelodyPlayerProps = {
        unitNumber: unitNumber,
        unitSpeed: speed,
        melody: melody,
        ballTexture: ballTextureUrl,
        connectionRange:connectionRange,
    };
    return props;
}

export function onMelodyPlayerRun(runner: Runner<ProcessProps>, callback: any) {
    const filereader: any = document.querySelector('#filereader input');
    const file = filereader.files[0];
    parseMidi(file, async (melody: Melody) => {
        showCanvans();
        const props = getProps(melody);
        runner.setUp(props);
        const statistics = await runner.run();
        callback(statistics);
    });
}
