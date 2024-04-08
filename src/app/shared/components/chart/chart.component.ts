import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, AfterViewInit {

  @Input() chartType;
  @Input() chartLabels: string[] = [];
  @Input() chartDatasets: any[] = [];
  @Input() chartOptions = {};
  @Input() chartHeight: number | string = '100%';
  @Input() centerText = '';
  @Input() centerIcon = '';
  @Input() centerValueColor: 'white' | 'blue' = 'blue';
  @Input() chartVariant: 'white' | 'blue' = 'blue';
  @Input() isCustomBgColors = false;
  @Input() indexAxis: 'y' | 'x' = 'x';
  backgroundColors = {};
  chartId = uuidv4();

  public chart: any;

  constructor() { }

  ngOnInit() {
    if (this.chartVariant === 'blue') {
      this.backgroundColors = {
        backgroundColor: [
          'rgba(53, 101, 255, 0.8)',
          'rgba(53, 101, 255, 0.5)',
          'rgba(53, 101, 255, 0.3)',
        ]
      };
    }

    if (this.chartVariant === 'white') {
      this.backgroundColors = {
        backgroundColor: [
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 0.8)',
          'rgba(255, 255, 255, 0.5)',
        ]
      };
    }

    if (!this.isCustomBgColors) {
      this.chartDatasets = [
        {
          ...this.chartDatasets[0],
          ...{
            ...this.backgroundColors
          }
        }
      ];
    }
  }

  ngAfterViewInit() {
    this.createChart({
      id: this.chartId,
      type: this.chartType,
      labels: this.chartLabels,
      datasets: this.chartDatasets
    });
  }

  createChart({ id, type, labels, datasets }) {
    this.chart = new Chart(id, {
      type,

      data: {
        labels,
        datasets
      },
      options: {
        ...this.chartOptions,
        ...{
          indexAxis: this.indexAxis,
        },
        ...{
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              display: false,
              title: {
                display: false
              }
            },
            y: {
              display: false,
              title: {
              display: false
            }
            }
          }
        }
      }
    });
  }
}
