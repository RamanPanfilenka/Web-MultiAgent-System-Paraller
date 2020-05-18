import { Statistics } from '@/multiagent-system/modules/common/models/primitives/statistics';
import Chart from 'chart.js';

export class StatisticRenderer {
    canvas: any;
    constructor(canvas: any) {
        this.canvas = canvas;
    }

    render(statistics: Array<Statistics>) {
        const data = {
            datasets: [{
                barPercentage: 0.5,
                barThickness: 6,
                maxBarThickness: 8,
                minBarLength: 2,
                data: statistics.map((elem, index) => {
                    return {x: index , y: elem.distanceTraveled};
                }),
            }],
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
        const myBarChart = new Chart(this.canvas.getContext('2d'), {
            type: 'bar',
            data: data,
            options: options,
        });
        myBarChart.render();
    }
}
