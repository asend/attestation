import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { forkJoin, lastValueFrom } from 'rxjs';
import { DashbordService, DemandeService } from 'src/app/services/services';
import { InfoStatistique } from '../card/card.component';
import { DemandeDto } from 'src/app/services/models/demande-dto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as Highcharts from 'highcharts';




@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.css']
})
export class StatistiqueComponent implements OnInit {

  selectedRegionFromGraph: string | null = null;
  showModal: boolean = false;
  selectedChartTypeRegion: string = 'bar';
  selectedChartTypeAllDemande: string = 'bar';

currentYear = 2020;


  Highcharts: typeof Highcharts = Highcharts;
  nombreDemandes: number | null = null;
  region = 'Dakar';
  hartConstructor = 'mapChart';
    chartConstructor = 'mapChart';
  chartOptions: Highcharts.Options = {};
  



  @ViewChild('pieChartContainer', { static: false }) pieChartContainer!: ElementRef;
  @ViewChild('barChartContainer', { static: false }) barChartContainer!: ElementRef;

  menuItems!: any[];


  pieChart: any;
  barChart: any;
  doughnutChart: any;
  lineChart: any; 

  naDemande: any;
  neDemande: any;
  ntDemande: any;
  nrDemande: any;
  statisques: Array<InfoStatistique> = [];

  demandes: DemandeDto[] = [];

  updateFlag = false; 
  chartOptionsSenegal: Highcharts.Options = {};
  statuts!: string[];
  erreurMessage!: string;
  nombreDemandesParStatut: any = {};

  
  constructor(private dashbordService: DashbordService, private demandeService: DemandeService,private cdr: ChangeDetectorRef) {
   }




  async ngOnInit() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // +1 car janvier = 0
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`; // ✅ Format attendu : dd-MM-yyyy
    
    this.loadChartData(formattedDate);
    this.loadChartDataBySexe();
    this.loadChartDataStatistiques();
    this.loadDemandesParRegion();
    this.loadStatistiquesParSemaine();



  }
  



  
  
  chartOptionsCercle: Highcharts.Options = {
    chart: {
      type: 'pie',
      events: {
        render() {
          const chart = this;
          const series = chart.series[0];
  
          if (!(chart as any).customLabel) {
            const total = series.data.reduce((acc, p) => acc + (p.y as number), 0);
            (chart as any).customLabel = chart.renderer.label(
              `Total<br/><strong>${total}</strong>`,
              series.center[0] + chart.plotLeft,
              series.center[1] + chart.plotTop,
              'rect',
              0, 0,
              true
            )
              .css({
                color: 'var(--highcharts-neutral-color-100, #000)',
                textAnchor: 'middle'
              })
              .add();
          }
  
          const label = (chart as any).customLabel;
          label.attr({
            x: series.center[0] + chart.plotLeft,
            y: series.center[1] + chart.plotTop - (label.getBBox().height / 2)
          });
  
          label.css({
            fontSize: `${series.center[2] / 12}px`
          });
        }
      }
    },
    accessibility: {
      point: { valueSuffix: '%' }
    },
    title: {
      text: 'Demandes par statut'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>'
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        innerSize: '75%',
        dataLabels: {
          enabled: true,
          useHTML: true,
          formatter: function (this: Highcharts.Point) {
            return `
              <div style="text-align:center; line-height:1.4;">
                <strong>${this.name}</strong><br/>
                ${this.y} <br/>
                ${Highcharts.numberFormat(this.percentage || 0, 0)}%
              </div>
            `;
          },
          style: {
            fontSize: '11px',
            color: '#000'
          }
        }
      }
    },
    series: [{
      type: 'pie',
      name: 'Demandes',
      colorByPoint: true,
      innerSize: '75%',
      data: [] // rempli dynamiquement dans ngOnInit
    } as any]
  };
  

// Par jour
  
  loadChartData(date: string): void {
    this.demandeService.getStatutDemandesParDate(date).subscribe(data => {
      this.chartOptionsBarDays = {
        chart: { type: 'column' },
        title: { text: `Statistiques pour ${date}` },
        xAxis: { categories: Object.keys(data) },
        yAxis: { title: { text: 'Nombre de demandes' } },
        series: [{
          name: 'Demandes',
          type: 'column',
          data: Object.values(data).map(v => Number(v)),
          colorByPoint: true,
          dataLabels: {
            enabled: true,
            style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
          }
        }]
      };
      console.log(this.chartOptionsBarDays.series);
      
    });
  }
  
  chartOptionsBarDays: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: 'Statistiques par jour' },
    xAxis: { categories: [] },
    yAxis: {
      title: { text: 'Nombre de demandes' }
    },
    series: [{
      name: 'Demandes',
      type: 'column',
      data: [],
      colorByPoint: true,
      dataLabels: {
        enabled: true
      }
    }]
  };
  

  chartOptionsTest: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Historic World Population by Region'
    },
    subtitle: {
      text: 'Source: <a href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population" target="_blank">Wikipedia.org</a>'
    },
    xAxis: {
      categories: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],  // ✅ Ajout de Vendredi
      title: {
        text: null
      },
      gridLineWidth: 1,
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Population (millions)',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      },
      gridLineWidth: 0
    },
    tooltip: {
      valueSuffix: ' millions'
    },
    plotOptions: {
      column: {
        borderRadius: 10,
        dataLabels: {
          enabled: true
        },
        groupPadding: 0.1
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor: 'var(--highcharts-background-color, #ffffff)',
      shadow: true
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'Year 1990',
        data: [632, 727, 3202, 721, 500],  // ✅ Ajout d'une valeur pour Vendredi
        type: 'column'
      },
      {
        name: 'Year 2000',
        data: [814, 841, 3714, 726, 610],  // ✅ Ajout d'une valeur pour Vendredi
        type: 'column'
      },
      {
        name: 'Year 2021',
        data: [1393, 1031, 4695, 745, 880],  // ✅ Ajout d'une valeur pour Vendredi
        type: 'column'
      }
    ]
  };


  countries: Record<string, { name: string, color: string, ucCode?: string }> = {
    kr: { name: 'South Korea', color: '#FE2371' },
    jp: { name: 'Japan', color: '#544FC5' },
    au: { name: 'Australia', color: '#2CAFFE' },
    de: { name: 'Germany', color: '#FE6A35' },
    ru: { name: 'Russia', color: '#6B8ABC' },
    cn: { name: 'China', color: '#1C74BD' },
    gb: { name: 'Great Britain', color: '#00A6A6' },
    us: { name: 'United States', color: '#D568FB' }
  };

  locations = [
    { city: 'Tokyo', year: 2020 },
    { city: 'Rio', year: 2016 },
    { city: 'London', year: 2012 },
    { city: 'Beijing', year: 2008 },
    { city: 'Athens', year: 2004 },
    { city: 'Sydney', year: 2000 }
  ];

   

  dataPrev: Record<number, [string, number][]> = {
    2020: [['kr', 9], ['jp', 12], ['au', 8], ['de', 17], ['ru', 19], ['cn', 26], ['gb', 27], ['us', 46]],
    2016: [['kr', 13], ['jp', 7], ['au', 8], ['de', 11], ['ru', 20], ['cn', 38], ['gb', 29], ['us', 47]],
    2012: [['kr', 13], ['jp', 9], ['au', 14], ['de', 16], ['ru', 24], ['cn', 48], ['gb', 19], ['us', 36]],
    2008: [['kr', 9], ['jp', 17], ['au', 18], ['de', 13], ['ru', 29], ['cn', 33], ['gb', 9], ['us', 37]],
    2004: [['kr', 8], ['jp', 5], ['au', 16], ['de', 13], ['ru', 32], ['cn', 28], ['gb', 11], ['us', 37]],
    2000: [['kr', 7], ['jp', 3], ['au', 9], ['de', 20], ['ru', 26], ['cn', 16], ['gb', 1], ['us', 44]]
  };
  
  data: Record<number, [string, number][]> = {
    2020: [['kr', 6], ['jp', 27], ['au', 17], ['de', 10], ['ru', 20], ['cn', 38], ['gb', 22], ['us', 39]],
    2016: [['kr', 9], ['jp', 12], ['au', 8], ['de', 17], ['ru', 19], ['cn', 26], ['gb', 27], ['us', 46]],
    2012: [['kr', 13], ['jp', 7], ['au', 8], ['de', 11], ['ru', 20], ['cn', 38], ['gb', 29], ['us', 47]],
    2008: [['kr', 13], ['jp', 9], ['au', 14], ['de', 16], ['ru', 24], ['cn', 48], ['gb', 19], ['us', 36]],
    2004: [['kr', 9], ['jp', 17], ['au', 18], ['de', 13], ['ru', 29], ['cn', 33], ['gb', 9], ['us', 37]],
    2000: [['kr', 8], ['jp', 5], ['au', 16], ['de', 13], ['ru', 32], ['cn', 28], ['gb', 11], ['us', 37]]
  };
  
  getData(dataSet: [string, number][]) {
    return dataSet.map(([code, value]) => ({
      name: code,
      y: value,
      color: this.countries[code]?.color || '#ccc'
    }));
  }

  initChart(year: number): void {
    if (!this.data[year] || !this.dataPrev[year]) return;

    this.chartOptions = {
      chart: { type: 'column' },
      title: {
        text: `Summer Olympics ${year} - Top 5 countries by Gold medals`,
        align: 'left'
      },
      subtitle: {
        text: `Comparing to results from ${year - 4}`,
        align: 'left'
      },
      plotOptions: {
        series: { borderWidth: 0 }
      },
      legend: { enabled: false },
      tooltip: {
        shared: true,
        headerFormat: '<span style="font-size: 15px">{point.key}</span><br/>',
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} medals</b><br/>'
      },
      xAxis: {
        type: 'category',
        max: 4
      },
      yAxis: {
        title: { text: 'Gold medals' },
        showFirstLabel: false
      },
      series: [
        {
          color: 'rgba(158, 159, 163, 0.5)',
          pointPlacement: -0.2,
          linkedTo: 'main',
          type: 'column',
          name: `${year - 4}`,
          data: this.dataPrev[year].slice()
        },
        {
          name: `${year}`,
          id: 'main',
          type: 'column',
          dataSorting: {
            enabled: true,
            matchByName: true
          },
          dataLabels: {
            enabled: true,
            inside: true,
            style: { fontSize: '16px' }
          },
          data: this.getData(this.data[year])
        }
      ]
    };
}








capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
getWeekDatesAvecJours(): { date: string, label: string }[] {
  const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const result: { date: string, label: string }[] = [];

  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);

    const dd = String(current.getDate()).padStart(2, '0');
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const yyyy = current.getFullYear();
    const jourNom = joursSemaine[current.getDay()];
    const dateStr = `${dd}-${mm}-${yyyy}`;
    const label = `${jourNom} (${dateStr})`;

    result.push({ date: dateStr, label });
  }

  return result;
}







chartOptionsBarBySexe: Highcharts.Options = {
  chart: { type: 'column' },
  title: { text: 'Statistiques des demandes Par Genre' },
  xAxis: {
    categories: [],  // on laisse vide au départ
    title: { text: null },
    gridLineWidth: 0.5,
    lineWidth: 0.5
  },
  yAxis: {
    min: 0,
    title: { text: 'Nombre de demandes', align: 'high' },
    labels: { overflow: 'justify' },
    gridLineWidth: 0.5
  },
  tooltip: { valueSuffix: ' demandes' },
  plotOptions: {
    column: {
      borderRadius: 10,
      groupPadding: 0.1,
      dataLabels: {
        enabled: true,
        style: { fontWeight: 'bold', color: '#000' },
        inside: false 
      }
    }
  },
  legend: { enabled: false },
  credits: { enabled: false },
  series: [{
    name: 'Demandes',
    type: 'column',
    data: [],  // vide au départ
    colorByPoint: true,
    colors: ['#43a9f0', '#912295'],
    dataLabels: {
      enabled: true,
      style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
    }
  }]
};


loadChartDataBySexe(): void {
  this.demandeService.getDemandesParSexe().subscribe((data: Array<{ [key: string]: any }>) => {
    const categories = data.map(item => this.capitalize(String(item['sexe'])));
    const values = data.map(item => Number(item['totalDemandes']));

    // Mise à jour des catégories et données dans les options
    this.chartOptionsBarBySexe = {
      ...this.chartOptionsBarBySexe,
      xAxis: { 
        ...(this.chartOptionsBarBySexe.xAxis as Highcharts.XAxisOptions), 
        categories: categories 
      },
      series: [{
        ...(this.chartOptionsBarBySexe.series?.[0] as Highcharts.SeriesColumnOptions),
        data: values
      }]
    };

    // Force la mise à jour du graphique
    this.updateFlag = true;
  });
}

private capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}




// Pour tous les demande et statut

  chartOptionsLine: Highcharts.Options = {
    title: { text: 'Statistiques des demandes (échelle linéaire)' },
    xAxis: {
      title: { text: 'Catégories' },
      categories: []
    },
    yAxis: {
      type: 'linear',
      title: { text: 'Nombre de demandes' }
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br />',
      pointFormat: '{point.y}'
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.y;
          },
          style: { fontWeight: 'bold', color: '#000' },
          align: 'center',
          verticalAlign: 'bottom',
          y: -5
        },
        enableMouseTracking: true
      }
    },
    series: [{
      name: 'Demandes',
      type: 'line',
      data: [],
      color: '#2caffe'
    }]
  };

  chartOptionsPie: Highcharts.Options = {
    chart: { type: 'pie' },
    title: { text: 'Répartition des demandes par statut' },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format:
            '<b>{point.name}</b><br/>{point.percentage:.1f} %<br/><b>{point.y}</b>',
          connectorColor: 'silver'
        }
      }
    },
    series: [{
      name: 'Demandes',
      type: 'pie',
      data: []
    }]
  };

  chartOptionsBar: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: 'Statistiques des demandes par statut' },
    xAxis: {
      categories: [],
      title: { text: null },
      gridLineWidth: 1,
      lineWidth: 0.5
    },
    yAxis: {
      min: 0,
      title: { text: 'Nombre de demandes', align: 'high' },
      labels: { overflow: 'justify' },
      gridLineWidth: 0.5
    },
    tooltip: { valueSuffix: ' demandes' },
    plotOptions: {
      column: {
        borderRadius: 10,
        groupPadding: 0.1,
        dataLabels: {
          enabled: true,
          style: { fontWeight: 'bold', color: '#000' },
          inside: false 
        }
      }
    },
    legend: { enabled: false },
    credits: { enabled: false },
    series: [{
      name: 'Demandes',
      type: 'column',
      data: [],
      colorByPoint: true,
      colors: ['#dad8d8', '#2fe306', '#f92e06', '#0ca7f5', '#e86c13'],
      dataLabels: {
        enabled: true,
        style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
      }
    }]
  };
  getChartOptionsTypeAllDemande(type: string): Highcharts.Options {
    switch (type) { 
      case 'line':
        return this.chartOptionsLine;
        case 'pie':
        return this.chartOptionsPie;
      case 'bar':
      default:
        return this.chartOptionsBar;
    }
  }

  loadChartDataStatistiques(): void {
    this.demandeService.getStatistiquesDemandes().subscribe(data => {
      const categories = ['Total', ...data.parStatut.map(item => item.statut)];
      const values = [data.totalGlobal, ...data.parStatut.map(item => item.total)];

      // === LINE ===
      this.chartOptionsLine = {
        ...this.chartOptionsLine,
        xAxis: {
          ...(this.chartOptionsLine.xAxis as Highcharts.XAxisOptions),
          categories: categories
        },
        series: [{
          ...(this.chartOptionsLine.series?.[0] as Highcharts.SeriesLineOptions),
          data: values
        }]
      };

      // === PIE ===
      const pieData = data.parStatut.map(item => ({
        name: item.statut,
        y: item.total
      }));
      this.chartOptionsPie = {
        ...this.chartOptionsPie,
        series: [{
          ...(this.chartOptionsPie.series?.[0] as Highcharts.SeriesPieOptions),
          data: pieData
        }]
      };

      // === BAR ===
      const barCategories = ['Toutes les demandes', ...data.parStatut.map(item => item.statut)];
      const barData = [data.totalGlobal, ...data.parStatut.map(item => item.total)];
      this.chartOptionsBar = {
        ...this.chartOptionsBar,
        xAxis: {
          ...(this.chartOptionsBar.xAxis as Highcharts.XAxisOptions),
          categories: barCategories
        },
        series: [{
          ...(this.chartOptionsBar.series?.[0] as Highcharts.SeriesColumnOptions),
          data: barData
        }]
      };

      this.updateFlag = true;
    });
  }




// le regions
  chartOptionsLineRegion: Highcharts.Options = {
    title: { text: 'Demandes par région (Line)' },
    xAxis: { categories: [] },
    yAxis: { title: { text: 'Nombre de demandes' }, type: 'linear' },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'black'
          }
        }
      }
    },
    series: [{ type: 'line', name: 'Demandes', data: [] }]
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
        }
      }
    },
    series: [{
      type: 'pie',
      name: 'Demandes',
      data: []
    }]
  };
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
      }
    }
  },
  series: [{ type: 'column', name: 'Demandes', data: [], colorByPoint: true }]
};

  getChartOptionsTypeRegion(type: string): Highcharts.Options {
    switch (type) { 
      case 'line':
        return this.chartOptionsLineRegion;
        case 'pie':
        return this.chartOptionsPieRegion;
      case 'bar':
      default:
        return this.chartOptionsBarRegion;
    }
  }
  loadDemandesParRegion(): void {
    this.demandeService.getDemandesParRegionAvecNom().subscribe({
      next: (data) => {
        data.sort((a, b) => a['region'].localeCompare(b['region']));
  
        const categories = data.map(item => item['region']);
        const values = data.map(item => item['totalDemandes']);
        const pieData = data.map(item => ({ name: item['region'], y: item['totalDemandes'] }));
  
        this.chartOptionsLineRegion = {
          ...this.chartOptionsLineRegion,
          xAxis: { categories },
          series: [{ type: 'line', name: 'Demandes', data: values }]
        };
  
        this.chartOptionsPieRegion = {
          ...this.chartOptionsPieRegion,
          series: [{ type: 'pie', name: 'Demandes', data: pieData }]
        };
  
        this.chartOptionsBarRegion = {
          ...this.chartOptionsBarRegion,
          xAxis: { categories },
          series: [{ type: 'column', name: 'Demandes', data: values, colorByPoint: true }]
        };
      },
      error: (err) => console.error('Erreur chargement demandes par région', err)
    });
  }


  // Par semaine

  loadStatistiquesParSemaine(): void {
    this.demandeService.getStatutDemandesSur7Jours().subscribe(data => {
      if (!data || data.length === 0) return;
  
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Pour ignorer l'heure
  
      const dayOfWeek = today.getDay(); // dimanche=0, lundi=1, ..., samedi=6
  
      // Calcul du lundi passé
      const diffToLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - diffToLastMonday);
  
      // Construire les 7 jours consécutifs à partir du lundi passé
      const joursDates = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        d.setHours(0, 0, 0, 0); // Ignorer l'heure
        if (d <= today) {
          joursDates.push(d);
        }
      }
  
      // Map des données reçues : clé = date au format yyyy-mm-dd
      const dataParDate = new Map<string, number>();
      data.forEach(d => {
        const dateKey = new Date(d.date).toISOString().slice(0, 10);
        dataParDate.set(dateKey, d.totalDemandes ?? 0);
      });
  
      // Construire catégories et les données totales uniquement pour les jours valides
      const categories = joursDates.map(d => {
        const jour = d.toLocaleDateString('fr-FR', { weekday: 'long' });
        const dateFormattee = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        return `${jour.charAt(0).toUpperCase() + jour.slice(1)} (${dateFormattee})`;
      });
  
      const totalData = joursDates.map(d => {
        const dateKey = d.toISOString().slice(0, 10);
        return dataParDate.get(dateKey) ?? 0;
      });
  
      const totalSeries = [{
        name: 'Total',
        type: 'column' as const,
        data: totalData,
        color: '#007bff'
      }];
  
      this.chartOptionsBarWeek = {
        ...this.chartOptionsBarWeek,
        xAxis: { categories },
        series: totalSeries
      };
  
      this.updateFlag = true;
    });
  }
  
  chartOptionsBarWeek: Highcharts.Options = {
  chart: { type: 'column' },
  title: { text: 'Statistiques par jour' },
  xAxis: { categories: [] },
  yAxis: {
    min: 0,
    title: { text: 'Nombre de demandes' }
  },
  tooltip: { shared: true },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: 'black'
        }
      },
      grouping: true,
      pointPadding: 0.2,
      borderWidth: 0,
      stacking: undefined
    }
  },
  
    series: [{
      type: 'column',
      name: 'Total',
      data: []
    }]
  };




  
  showDepartementPopup(region: string): void {
    this.selectedRegionFromGraph = region;
    this.showModal = true;
  }
  

  
    
 
}
  








