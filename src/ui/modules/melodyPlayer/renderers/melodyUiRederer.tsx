
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import $ from 'jquery';
import { UiRenderer } from '../../common/renderers/uiRenderer';
import { MelodyStatistics } from '@/multiagent-system/modules/melody-player/models/primitives/melodyStatistics';
import { Statistics } from '@/multiagent-system/modules/common/models/primitives/statistics';

export class MelodyUiRederer extends UiRenderer {
    render(): void {
        const settingsContainer = (
            <div className="settings-container bp3-card bp3-elevation-0 bp3-elevation-1 bp3-elevation-2 bp3-elevation-3 bp3-elevation-4">
                <h3 className="title">Melody Player Settings</h3>
                {this.createNumbericContainer('unit-count container', 'Unit Number', 'unit-count', 1, 1, 100, 'unit-count')}
                {this.createNumbericContainer('speed container', 'Speed', 'speed', 1, 1, 100, 'speed')}
                {this.createNumbericContainer('connection-range container', 'Connect Range', 'connection-range', 1000, 0, 2000, 'connection-range')}
                {this.createFileInput('filereader', 'Choose Midi File')}
                {this.createSubmitButton('start', 'Start', true)}
            </div>
        );
        const centerContainer = document.querySelector('.settings');
        ReactDOM.render(settingsContainer, centerContainer);
    }

    subscribe(callback: any) {
        $('#filereader').change(() => {
            $('#start').removeAttr('disabled');
            $('#start').removeClass('bp3-disabled');
        });
        $('#start').click(async () => {
            callback();
        });
    }

    renderStatistics(statistics: Array<MelodyStatistics>) {
        this.renderCharsContainer();
        this.setCharsStyles();

        const traveledData: any[] = [];
        const traveledLabels: any[] = [];
        let playedNotesPersent = 0;
        console.log(statistics);
        statistics.forEach((stat, index) => {
            traveledData.push(stat.distanceTraveled);
            traveledLabels.push(index);
            playedNotesPersent += stat.playedNotesPercent;
        });
        this.renderTraveledBarChar(traveledData, traveledLabels);
        this.renderPlayedNoteDoughnutChart(playedNotesPersent);
    }


    private renderCharsContainer() {
        const container = document.querySelector('.chars');
        const graph = (
            <div className="chars-container bp3-card bp3-elevation-0 bp3-elevation-1 bp3-elevation-2 bp3-elevation-3 bp3-elevation-4">
                <div className="chart-travaled-distance">
                    <canvas id="travaled-distance"></canvas>
                </div>
                <div className="chart-plyed-note">
                    <canvas id="plyed-note"></canvas>
                </div>
            </div>
        );
        ReactDOM.render(graph, container);
    }

    private setCharsStyles() {
        $('#view').hide();
        $('.chars').css('display', 'flex');
        $('.chars').css('height', '350px');
        $('.chart-travaled-distance').css('width', '50%');
        $('.chart-plyed-note').css('width', '50%');
    }

    private renderTraveledBarChar(traveledData: Array<any>, traveledLabels: Array<any>) {
        const travaledDistanceCanvans: any = document.querySelector('#travaled-distance');
        const travaledDistanceContext = travaledDistanceCanvans.getContext('2d');
        this.renderBarChart(traveledData, traveledLabels, travaledDistanceContext);
    }

    private renderPlayedNoteDoughnutChart(playedNotesPersent: number) {
        const playedNoteCanvans: any = document.querySelector('#plyed-note');
        const playedNoteContext = playedNoteCanvans.getContext('2d');
        this.renderDoughnutChart([playedNotesPersent, 1 - playedNotesPersent], ['Сыграно нот', 'Не сыграно нот'], playedNoteContext);
    }

}
