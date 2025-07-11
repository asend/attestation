import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
onChartInstance($event: Highcharts.Chart) {
throw new Error('Method not implemented.');
}
closeDepartementPopup() {
throw new Error('Method not implemented.');
}
getChartOptionsByType(arg0: any,arg1: any): Highcharts.Options {
throw new Error('Method not implemented.');
}
  Highcharts: typeof Highcharts = Highcharts;
  selectedChartTypeRegion: string = 'bar';
  showModal: boolean = false;
  selectedRegionFromGraph: string = '';

  chartOptionsBarRegion: Highcharts.Options = {
    title: { text: 'Demandes par région (Bar)' },
    xAxis: { categories: [] },
    yAxis: { title: { text: 'Nombre de demandes' } },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'black'
          }
        },
        point: {
          events: {
            click: (event: any) => {
              this.showDepartementPopup(event.point.category);
            }
          }
        }
      }
    },
    series: [{
      type: 'column',
      name: 'Demandes',
      data: [100, 80, 150],
      colorByPoint: true
    }]
  };

  chartOptionsPieRegion: Highcharts.Options = {
    title: { text: 'Demandes par région (Pie)' },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}',
          style: {
            fontWeight: 'bold'
          }
        },
        point: {
          events: {
            click: (event: any) => {
              this.showDepartementPopup(event.point.name);
            }
          }
        }
      }
    },
    series: [{
      type: 'pie',
      name: 'Demandes',
      data: [
        { name: 'Fatick', y: 100 },
        { name: 'Kaolack', y: 80 },
        { name: 'Kaffrine', y: 150 }
      ]
    }]
  };

  chartOptionsLineRegion: Highcharts.Options = {
    title: { text: 'Demandes par région (Line)' },
    xAxis: { categories: ['Fatick', 'Kaolack', 'Kaffrine'] },
    yAxis: { title: { text: 'Nombre de demandes' }, type: 'linear' },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'black'
          }
        },
        point: {
          events: {
            click: (event: any) => {
              this.showDepartementPopup(event.point.category);
            }
          }
        }
      }
    },
    series: [{
      type: 'line',
      name: 'Demandes',
      data: [100, 80, 150]
    }]
  };
updateFlag!: boolean;
isDepartementPopupVisible: any;
selectedRegionPopup: any;
selectedChartTypePopup: any;

  constructor() {}

  ngOnInit(): void {}

  getChartOptionsTypeRegion(type: string): Highcharts.Options {
    switch (type) {
      case 'line': return this.chartOptionsLineRegion;
      case 'pie': return this.chartOptionsPieRegion;
      default: return this.chartOptionsBarRegion;
    }
  }

  showDepartementPopup(region: string): void {
    this.selectedRegionFromGraph = region;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  getChartOptionsByTypeRegion(region: string): Highcharts.Options {
    // Remplacez par la logique réelle par région
    return this.chartOptionsBarRegion;
  }
}
