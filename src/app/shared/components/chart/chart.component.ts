import { Component, Input, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface IDataset {
  label: string, 
  data: string|number[], 
  backgroundColor: string []
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  chartId = uuidv4();
  @Input() chartType;
  @Input() chartLabels: string[] = []
  @Input() chartDatasets: any[] = []
  @Input() chartOptions = {}
  @Input() chartHeight: number|string = "100%"

  public chart: any;

  constructor() { }

  ngOnInit() { 
  }

  ngAfterViewInit(){
    this.createChart({
      id: this.chartId,
      type: this.chartType,
      labels: this.chartLabels,
      datasets: this.chartDatasets
    });
  }

  createChart({ id, type, labels, datasets }){
    this.chart = new Chart(id, {
      type: type,

      data: {
        labels,
	       datasets
      }, 
      options: {
        ...this.chartOptions
      }     
    });
  }
}
