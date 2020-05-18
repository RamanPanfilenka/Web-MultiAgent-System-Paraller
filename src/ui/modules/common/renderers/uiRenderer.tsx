import $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Slider, FileInput, NumericInput } from '@blueprintjs/core';
import { Statistics } from '@/multiagent-system/modules/common/models/primitives/statistics';
import Chart from 'chart.js';
import ColorHash from 'color-hash';

export abstract class UiRenderer {
    renderSlider(container: Element, min: number, max: number, stepSize: number,  value: number, labelRenderer: boolean, disabled: false) {
        const elem = React.createElement(Slider, {
            max : 100,
            min: 1,
            labelRenderer: false,
            stepSize: 1,
            disabled: false,
            value: 1,
        });
        ReactDOM.render(elem, container);
    }

    createNumbericInput( id: string, value: number, min: number, max: number, name: string) {
        const elem = React.createElement(NumericInput, { id: id, value: value, min: min, max: max, name:  name});
        return elem;
    }

    createLabelContainer(containerClassName: string, labelFor: string, text: string, element: any) {
        const container = (
            <div className={containerClassName}>
                <label htmlFor={labelFor}>{text}:
                    {element}
                </label>
            </div>
        );
        return container;
    }

    createNumbericContainer(containerClassName: string, labelText: string,
        id: string, value: number, min: number, max: number, name: string) {
        const elem = this.createNumbericInput(id, value, min, max, name);
        const container = this.createLabelContainer(containerClassName, name, labelText, elem);
        return container;
    }

    createFileInput(id: string, text: string) {
        const elem = React.createElement(FileInput, { id: id,  text: text});
        return (
            <div className="file-input container">
                {elem}
            </div>
        );
    }

    createSubmitButton(id: string, text: string, disabled: boolean) {
        const elem = React.createElement(Button, { id: id,  text: text, type: 'submit', disabled: disabled, large: true});
        return (
            <div className="button container">
                {elem}
            </div>
        );
    }

    renderStatistics(statistics: Array<Statistics>) {
        $('#view').hide();
        $('.chars').css('display', 'flex');
        const container = document.querySelector('.chars');
        const graph = (
            <div className="chars-container bp3-card bp3-elevation-0 bp3-elevation-1 bp3-elevation-2 bp3-elevation-3 bp3-elevation-4">
                <div className="chart-travaled-distance">
                    <canvas id="travaled-distance"></canvas>
                </div>
            </div>
        );
        ReactDOM.render(graph, container);
        const canvans: any = document.querySelector('#travaled-distance');
        const context = canvans.getContext('2d');
        const data = statistics.map((elem, index)=> elem.distanceTraveled);
        const labels = statistics.map((elem, index) => index);
        this.renderBarChart(data, labels, context);
    }

    renderBarChart(data: Array<any>, labels: Array<any> , context: any) {
        const colorHash = new ColorHash();
        const graphData = {
            datasets: [{
                label: 'Пройденной растояние каждым агентом',
                data: data,
                backgroundColor: data.map(elem => colorHash.hex(elem)),
            }],
            labels: labels,
        };
        const options = {
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true,
                }],
            },
        };
        const barChart = new Chart(context, {
            type: 'bar',
            data: graphData,
            options: options,
        });
        barChart.render();
    }

    renderDoughnutChart(data: Array<any>, labels: Array<any> , context: any) {
        const colorHash = new ColorHash();
        const graphData = {
            datasets: [{
                label: 'Пройденной растояние каждым агентом',
                data: data,
                backgroundColor: data.map(elem => colorHash.hex(elem)),
            }],
            labels: labels,
        };
        const doughnutChart = new Chart(context, {
            type: 'pie',
            data: graphData,
        });
        doughnutChart.render();
    }

    abstract render(): void;

    abstract subscribe(onRunCallback: any): void;
}
