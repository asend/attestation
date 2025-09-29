import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { forkJoin, lastValueFrom } from 'rxjs';
import { DashbordService, DemandeService } from 'src/app/services/services';
import { InfoStatistique } from '../card/card.component';
import { DemandeDto } from 'src/app/services/models/demande-dto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as Highcharts from 'highcharts';
import { Router } from '@angular/router';




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

  regions: string[] = [
    'Dakar', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda',
    'Louga', 'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Thiès', 'Ziguinchor'
  ];


  isModalOpen: boolean = false;
  selectedRegion: string = '';

  selectedChartType: string = 'bar';
  selectedChartTypeDiourbel: string = 'pie';
  selectedChartTypeFatick: string = 'bar'; 
  selectedChartTypeKaffrine: string = 'line'; 
  selectedChartTypeKaolack: string = 'bar'; 
  selectedChartTypeKedougou: string = 'line';  
  selectedChartTypeKolda: string = 'line';  
  selectedChartTypeLouga: string = 'bar';  
  selectedChartTypeMatam: string = 'libarne';  
  selectedChartTypeSaintLouis: string = 'line';  
  selectedChartTypeSedhiou: string = 'line';  
  selectedChartTypeTambacounda: string = 'bar';  
  selectedChartTypeThies: string = 'line';  
  selectedChartTypeZiguinchor: string = 'bar';  




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

  regionCategories: string[] = [];

  constructor(private dashbordService: DashbordService, 
    private demandeService: DemandeService,
    private cdr: ChangeDetectorRef,
    private router: Router) {
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
    this.loadDepartmentStats();



  }
  



  
  
  // chartOptionsCercle: Highcharts.Options = {
  //   chart: {
  //     type: 'pie',
  //     events: {
  //       render() {
  //         const chart = this;
  //         const series = chart.series[0];
  
  //         if (!(chart as any).customLabel) {
  //           const total = series.data.reduce((acc, p) => acc + (p.y as number), 0);
  //           (chart as any).customLabel = chart.renderer.label(
  //             `Total<br/><strong>${total}</strong>`,
  //             series.center[0] + chart.plotLeft,
  //             series.center[1] + chart.plotTop,
  //             'rect',
  //             0, 0,
  //             true
  //           )
  //             .css({
  //               color: 'var(--highcharts-neutral-color-100, #000)',
  //               textAnchor: 'middle'
  //             })
  //             .add();
  //         }
  
  //         const label = (chart as any).customLabel;
  //         label.attr({
  //           x: series.center[0] + chart.plotLeft,
  //           y: series.center[1] + chart.plotTop - (label.getBBox().height / 2)
  //         });
  
  //         label.css({
  //           fontSize: `${series.center[2] / 12}px`
  //         });
  //       }
  //     }
  //   },
  //   accessibility: {
  //     point: { valueSuffix: '%' }
  //   },
  //   title: {
  //     text: 'Demandes par statut'
  //   },
  //   tooltip: {
  //     pointFormat: '{series.name}: <b>{point.y}</b>'
  //   },
  //   legend: {
  //     enabled: false
  //   },
  //   plotOptions: {
  //     pie: {
  //       allowPointSelect: true,
  //       cursor: 'pointer',
  //       innerSize: '75%',
  //       dataLabels: {
  //         enabled: true,
  //         useHTML: true,
  //         formatter: function (this: Highcharts.Point) {
  //           return `
  //             <div style="text-align:center; line-height:1.4;">
  //               <strong>${this.name}</strong><br/>
  //               ${this.y} <br/>
  //               ${Highcharts.numberFormat(this.percentage || 0, 0)}%
  //             </div>
  //           `;
  //         },
  //         style: {
  //           fontSize: '11px',
  //           color: '#000'
  //         }
  //       }
  //     }
  //   },
  //   series: [{
  //     type: 'pie',
  //     name: 'Demandes',
  //     colorByPoint: true,
  //     innerSize: '75%',
  //     data: [] // rempli dynamiquement dans ngOnInit
  //   } as any]
  // };
  

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

// getWeekDatesAvecJours(): { date: string, label: string }[] {
//   const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
//   const today = new Date();
//   const dayOfWeek = today.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
//   const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

//   const monday = new Date(today);
//   monday.setDate(today.getDate() + diffToMonday);

//   const result: { date: string, label: string }[] = [];

//   for (let i = 0; i < 7; i++) {
//     const current = new Date(monday);
//     current.setDate(monday.getDate() + i);

//     const dd = String(current.getDate()).padStart(2, '0');
//     const mm = String(current.getMonth() + 1).padStart(2, '0');
//     const yyyy = current.getFullYear();
//     const jourNom = joursSemaine[current.getDay()];
//     const dateStr = `${dd}-${mm}-${yyyy}`;
//     const label = `${jourNom} (${dateStr})`;

//     result.push({ date: dateStr, label });
//   }

//   return result;
// }




// Par sexe

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
       allowPointSelect: true,
        cursor: 'pointer',
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
          legend: {
            margin: 10,
            itemStyle: {
              color: 'red',
              fontSize: '15px',
            }
          },
          plotOptions: {
            column: {
              point: {
                events: {
                  click: (event: any) => {
                    const regionName = event.point.category;
                    this.selectedRegion = regionName;
                    this.openModal(regionName);
                  }
                }
              },
              dataLabels: {
                enabled: true,
                style: {
                  fontWeight: 'bold',
                  color: 'blue',
                  textDecoration: 'underline', // ✅ ajoute le soulignement
                  cursor: 'pointer'            // ✅ ajoute un curseur "main" pour effet lien
                }
              }
            }
          },
          series: [{
            type: 'column',
            name: 'Total Demande',
            data: values,
            colorByPoint: true
          }]
        }; 
      },
      error: (err) => console.error('Erreur chargement demandes par région', err)
    });
  }






  // getChartOptionsByRegion(regionName: string, chartType: string): Highcharts.Options {

  //   // Exemples simplifiés, adapte selon tes données et besoins
  //   switch (regionName) {
  //     case 'Dakar':
  //       return this.getChartOptionsDakar(chartType);
  //     case 'Diourbel':
  //       return this.getChartOptionsDiourbel(chartType);
  //     case 'Fatick':
  //       return this.getChartOptionsFatick(chartType);
  //     // ... ajoute les autres régions ici
  //     default:
  //       return {};
  //   }
  // }
  // getChartOptionsDakar(chartType: string): Highcharts.Options {
  //   return {
  //     chart: {
  //       type: chartType as any
  //     },
  //     title: { text: 'Données de la région Dakar' },
  //     xAxis: {
  //       categories: ['Catégorie 1', 'Catégorie 2', 'Catégorie 3']
  //     },
  //     series: [{
  //       name: 'Exemple',
  //       type: chartType as any,
  //       data: [10, 20, 30]
  //     }]
  //   };
  // }
  // getChartOptionsDiourbel(chartType: string): Highcharts.Options {
  //   return {
  //     chart: {
  //       type: chartType as any
  //     },
  //     title: { text: 'Données de la région Diourbel' },
  //     xAxis: {
  //       categories: ['Catégorie A', 'Catégorie B', 'Catégorie C']
  //     },
  //     series: [{
  //       name: 'Exemple',
  //       type: chartType as any,
  //       data: [15, 25, 35]
  //     }]
  //   };
  // }
  // getChartOptionsFatick(chartType: string): Highcharts.Options {
  //   return {
  //     chart: {
  //       type: chartType as any
  //     },
  //     title: { text: 'Données de la région Fatick' },
  //     xAxis: {
  //       categories: ['X', 'Y', 'Z']
  //     },
  //     series: [{
  //       name: 'Exemple',
  //       type: chartType as any,
  //       data: [5, 12, 18]
  //     }]
  //   };
  // }



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




  
  openModal(region: string) {
    this.selectedRegion = region;
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false; // Ferme la modale
  } 




  // les departements les departments

loadDepartmentStats(): void {
  this.demandeService.getDemandesParRegionEtDepartement().subscribe((data: Array<{ [key: string]: any }>) => {
    // --- Dakar ---
    const dakar = data.find(region => region['region'] === 'Dakar');
    if (dakar && dakar['departements']) {
      const categoriesDakar = dakar['departements'].map((dep: any) => dep['departement']);
      const valuesDakar = dakar['departements'].map((dep: any) => dep['totalDemandes']);
      const pieDataDakar = dakar['departements'].map((dep: any) => ({
        name: dep['departement'],
        y: dep['totalDemandes']
      }));

      // Mise à jour pie chart Dakar
      (this.chartOptionsPieDepartmentDakar.series![0] as Highcharts.SeriesPieOptions).data = pieDataDakar;

      // Mise à jour line chart Dakar
      this.chartOptionsLinepieDepartmentDakar.xAxis = { categories: categoriesDakar };
      (this.chartOptionsLinepieDepartmentDakar.series![0] as Highcharts.SeriesLineOptions).data = valuesDakar;

      // Mise à jour bar chart Dakar
      this.chartOptionsBarDepartmentDakar.xAxis = { categories: categoriesDakar };
      (this.chartOptionsBarDepartmentDakar.series![0] as Highcharts.SeriesColumnOptions).data = valuesDakar;

      this.updateFlag = true;
    }

    // --- Diourbel ---
    const diourbel = data.find(region => region['region'] === 'Diourbel');
    if (diourbel && diourbel['departements']) {
      const categoriesDiourbel = diourbel['departements'].map((dep: any) => dep['departement']);
      const valuesDiourbel = diourbel['departements'].map((dep: any) => dep['totalDemandes']);
      const pieDataDiourbel = diourbel['departements'].map((dep: any) => ({
        name: dep['departement'],
        y: dep['totalDemandes']
      }));

      // Mise à jour pie chart Diourbel
      this.chartOptionsPieDepartmentDiourbel = {
        ...this.chartOptionsPieDepartmentDiourbel,
        series: [{
          type: 'pie',
          name: 'Demandes',
          data: pieDataDiourbel
        }]
      };

      // Mise à jour line chart Diourbel
      this.chartOptionsLineDepartmentDiourbel = {
        ...this.chartOptionsLineDepartmentDiourbel,
        xAxis: { ...this.chartOptionsLineDepartmentDiourbel.xAxis, categories: categoriesDiourbel },
        series: [{
          name: 'Demandes',
          type: 'line',
          data: valuesDiourbel,
          color: '#2caffe'
        }]
      };

      // Mise à jour bar chart Diourbel
      this.chartOptionsBarDepartmentDiourbel = {
        ...this.chartOptionsBarDepartmentDiourbel,
        xAxis: { ...this.chartOptionsBarDepartmentDiourbel.xAxis, categories: categoriesDiourbel },
        series: [{
          name: 'Demandes',
          type: 'column',
          data: valuesDiourbel
        }]
      };

    }

    // --- fatick ---
    const fatick = data.find(region => region['region'] === 'Fatick');
    if (fatick && fatick['departements']) {
      const categoriesFatick = fatick['departements'].map((dep: any) => dep['departement']);

      // Remplacer null ou undefined par 0 dans les valeurs
      const valuesFatick = fatick['departements'].map((dep: any) => (dep['totalDemandes'] ?? 0));

      const pieDataFatick = fatick['departements'].map((dep: any) => ({
        name: dep['departement'],
        y: dep['totalDemandes'] ?? 0
      }));

      // Mise à jour des charts
      (this.chartOptionsPieDepartmentFatick.series![0] as Highcharts.SeriesPieOptions).data = pieDataFatick;
      this.chartOptionsLineDepartmentFatick.xAxis = { ...this.chartOptionsLineDepartmentFatick.xAxis, categories: categoriesFatick };
      (this.chartOptionsLineDepartmentFatick.series![0] as Highcharts.SeriesLineOptions).data = valuesFatick;
      this.chartOptionsBarDepartmentFatick.xAxis = { ...this.chartOptionsBarDepartmentFatick.xAxis, categories: categoriesFatick };
      (this.chartOptionsBarDepartmentFatick.series![0] as Highcharts.SeriesColumnOptions).data = valuesFatick;

      this.updateFlag = true;
    }

    // --- Kaffrine ---
    const kaffrine = data.find(region => region['region'] === 'Kaffrine');
    if (kaffrine && kaffrine['departements']) {
      const categoriesKaffrine = kaffrine['departements'].map((dep: any) => dep['departement']);

      const valuesKaffrine = kaffrine['departements'].map((dep: any) => dep['totalDemandes'] ?? 0);

      const pieDataKaffrine = kaffrine['departements'].map((dep: any) => ({
        name: dep['departement'],
        y: dep['totalDemandes'] ?? 0
      }));

      // ✅ Mise à jour Pie chart Kaffrine
      (this.chartOptionsPieDepartmentKaffrine.series![0] as Highcharts.SeriesPieOptions).data = pieDataKaffrine;

      // ✅ Mise à jour Line chart Kaffrine
      this.chartOptionsLineDepartmentKaffrine.xAxis = {
        ...this.chartOptionsLineDepartmentKaffrine.xAxis,
        categories: categoriesKaffrine
      };
      (this.chartOptionsLineDepartmentKaffrine.series![0] as Highcharts.SeriesLineOptions).data = valuesKaffrine;

      // ✅ Mise à jour Bar chart Kaffrine
      this.chartOptionsBarDepartmentKaffrine.xAxis = {
        ...this.chartOptionsBarDepartmentKaffrine.xAxis,
        categories: categoriesKaffrine
      };
      (this.chartOptionsBarDepartmentKaffrine.series![0] as Highcharts.SeriesColumnOptions).data = valuesKaffrine;

      this.updateFlag = true;
    }
    // --- Kaolack ---
    const kaolack = data.find(region => region['region'] === 'Kaolack');
    if (kaolack && kaolack['departements']) {
      const categoriesKaolack = kaolack['departements'].map((dep: any) => dep['departement']);
      const valuesKaolack = kaolack['departements'].map((dep: any) => dep['totalDemandes'] ?? 0);
      const pieDataKaolack = kaolack['departements'].map((dep: any) => ({
        name: dep['departement'],
        y: dep['totalDemandes'] ?? 0
      }));

      (this.chartOptionsPieDepartmentKaolack.series![0] as Highcharts.SeriesPieOptions).data = pieDataKaolack;

      this.chartOptionsLineDepartmentKaolack.xAxis = {
        ...this.chartOptionsLineDepartmentKaolack.xAxis,
        categories: categoriesKaolack
      };
      (this.chartOptionsLineDepartmentKaolack.series![0] as Highcharts.SeriesLineOptions).data = valuesKaolack;

      this.chartOptionsBarDepartmentKaolack.xAxis = {
        ...this.chartOptionsBarDepartmentKaolack.xAxis,
        categories: categoriesKaolack
      };
      (this.chartOptionsBarDepartmentKaolack.series![0] as Highcharts.SeriesColumnOptions).data = valuesKaolack;

      this.updateFlag = true;
    }

  // -- kedougou --
    const kedougou = data.find(region => region['region'] === 'Kédougou');
    if (kedougou && kedougou['departements']) {
      const categoriesKedougou = kedougou['departements'].map((dep: any) => dep['departement']);
      const valuesKedougou = kedougou['departements'].map((dep: any) => dep['totalDemandes'] ?? 0);
      const pieDataKedougou = kedougou['departements'].map((dep: any) => ({
        name: dep['departement'],
        y: dep['totalDemandes'] ?? 0
      }));

      (this.chartOptionsPieDepartmentKedougou.series![0] as Highcharts.SeriesPieOptions).data = pieDataKedougou;

      this.chartOptionsLineDepartmentKedougou.xAxis = {
        ...this.chartOptionsLineDepartmentKedougou.xAxis,
        categories: categoriesKedougou
      };
      (this.chartOptionsLineDepartmentKedougou.series![0] as Highcharts.SeriesLineOptions).data = valuesKedougou;

      this.chartOptionsBarDepartmentKedougou.xAxis = {
        ...this.chartOptionsBarDepartmentKedougou.xAxis,
        categories: categoriesKedougou
      };
      (this.chartOptionsBarDepartmentKedougou.series![0] as Highcharts.SeriesColumnOptions).data = valuesKedougou;

      this.updateFlag = true;
    }

    // --- kolda --
    const kolda = data.find(region => region['region'] === 'Kolda');
    if (kolda && kolda['departements']) {
      const categoriesKolda = kolda['departements'].map((dep: any) => dep['departement']);
      const valuesKolda = kolda['departements'].map((dep: any) => dep['totalDemandes'] ?? 0);
      const pieDataKolda = kolda['departements'].map((dep: any) => ({
        name: dep['departement'],
        y: dep['totalDemandes'] ?? 0
      }));

      (this.chartOptionsPieDepartmentkolda.series![0] as Highcharts.SeriesPieOptions).data = pieDataKolda;

      this.chartOptionsLineDepartmentkolda.xAxis = {
        ...this.chartOptionsLineDepartmentkolda.xAxis,
        categories: categoriesKolda
      };
      (this.chartOptionsLineDepartmentkolda.series![0] as Highcharts.SeriesLineOptions).data = valuesKolda;

      this.chartOptionsBarDepartmentkolda.xAxis = {
        ...this.chartOptionsBarDepartmentkolda.xAxis,
        categories: categoriesKolda
      };
      (this.chartOptionsBarDepartmentkolda.series![0] as Highcharts.SeriesColumnOptions).data = valuesKolda;

      this.updateFlag = true;
    }

    // -- Louga --
    const louga = data.find(region => region['region'] === 'Louga');
    if (louga && louga['departements']) {
      const categoriesLouga = louga['departements'].map((dep: any) => dep['departement']);
      const valuesLouga = louga['departements'].map((dep: any) => dep['totalDemandes'] ?? 0);
      const pieDataLouga = louga['departements'].map((dep: any) => ({
        name: dep['departement'],
        y: dep['totalDemandes'] ?? 0
      }));

      (this.chartOptionsPieDepartmentLouga.series![0] as Highcharts.SeriesPieOptions).data = pieDataLouga;

      this.chartOptionsLineDepartmentLouga.xAxis = {
        ...this.chartOptionsLineDepartmentLouga.xAxis,
        categories: categoriesLouga
      };
      (this.chartOptionsLineDepartmentLouga.series![0] as Highcharts.SeriesLineOptions).data = valuesLouga;

      this.chartOptionsBarDepartmentLouga.xAxis = {
        ...this.chartOptionsBarDepartmentLouga.xAxis,
        categories: categoriesLouga
      };
      (this.chartOptionsBarDepartmentLouga.series![0] as Highcharts.SeriesColumnOptions).data = valuesLouga;

      this.updateFlag = true;
    }

    // -- Mata --
    // --- Matam ---
    const matam = data.find(region => region['region'] === 'Matam');
    if (matam && matam['departements']) {
      const categoriesMatam = matam['departements'].map((dep: any) => dep['departement']);
      const valuesMatam = matam['departements'].map((dep: any) => dep['totalDemandes'] ?? 0);
      const pieDataMatam = matam['departements'].map((dep: any) => ({
        name: dep['departement'],
        y: dep['totalDemandes'] ?? 0
      }));

      // ✅ Mise à jour Pie chart Matam
      (this.chartOptionsPieDepartmentMatam.series![0] as Highcharts.SeriesPieOptions).data = pieDataMatam;

      // ✅ Mise à jour Line chart Matam
      this.chartOptionsLineDepartmentMatam.xAxis = {
        ...this.chartOptionsLineDepartmentMatam.xAxis,
        categories: categoriesMatam
      };
      (this.chartOptionsLineDepartmentMatam.series![0] as Highcharts.SeriesLineOptions).data = valuesMatam;

      // ✅ Mise à jour Bar chart Matam
      this.chartOptionsBarDepartmentMatam.xAxis = {
        ...this.chartOptionsBarDepartmentMatam.xAxis,
        categories: categoriesMatam
      };
      (this.chartOptionsBarDepartmentMatam.series![0] as Highcharts.SeriesColumnOptions).data = valuesMatam;

      this.updateFlag = true;
    }
    // -- Saint-Louis
          const saintLouis = data.find(region => region['region'] === 'Saint-Louis');
        if (saintLouis && saintLouis['departements']) {
          const categories = saintLouis['departements'].map((dep: any) => dep['departement']);
          const values = saintLouis['departements'].map((dep: any) => dep['totalDemandes'] ?? 0);
          const pieData = saintLouis['departements'].map((dep: any) => ({
            name: dep['departement'],
            y: dep['totalDemandes'] ?? 0
          }));

          // Mise à jour Pie chart Saint-Louis
          (this.chartOptionsPieDepartmentSaintLouis.series![0] as Highcharts.SeriesPieOptions).data = pieData;

          // Mise à jour Line chart Saint-Louis
          this.chartOptionsLineDepartmentSaintLouis.xAxis = {
            ...this.chartOptionsLineDepartmentSaintLouis.xAxis,
            categories: categories
          };
          (this.chartOptionsLineDepartmentSaintLouis.series![0] as Highcharts.SeriesLineOptions).data = values;

          // Mise à jour Bar chart Saint-Louis
          this.chartOptionsBarDepartmentSaintLouis.xAxis = {
            ...this.chartOptionsBarDepartmentSaintLouis.xAxis,
            categories: categories
          };
          (this.chartOptionsBarDepartmentSaintLouis.series![0] as Highcharts.SeriesColumnOptions).data = values;

          this.updateFlag = true; // si vous utilisez un flag pour rafraîchir la vue Angular
        }
    
        // -- Sedhiou --
        const sedhiou = data.find(region => region['region'] === 'Sédhiou');
        if (sedhiou && sedhiou['departements']) {
          const categories = sedhiou['departements'].map((dep: any) => dep['departement']);
          const values = sedhiou['departements'].map((dep: any) => dep['totalDemandes'] ?? 0);
          const pieData = sedhiou['departements'].map((dep: any) => ({
            name: dep['departement'],
            y: dep['totalDemandes'] ?? 0
          }));

          // Mise à jour Pie chart Sédhiou
          (this.chartOptionsPieDepartmentSedhiou.series![0] as Highcharts.SeriesPieOptions).data = pieData;

          // Mise à jour Line chart Sédhiou
          this.chartOptionsLineDepartmentSedhiou.xAxis = {
            ...this.chartOptionsLineDepartmentSedhiou.xAxis,
            categories: categories
          };
          (this.chartOptionsLineDepartmentSedhiou.series![0] as Highcharts.SeriesLineOptions).data = values;

          // Mise à jour Bar chart Sédhiou
          this.chartOptionsBarDepartmentSedhiou.xAxis = {
            ...this.chartOptionsBarDepartmentSedhiou.xAxis,
            categories: categories
          };
          (this.chartOptionsBarDepartmentSedhiou.series![0] as Highcharts.SeriesColumnOptions).data = values;

          this.updateFlag = true; // Indique à Angular de rafraîchir les graphiques
        }

        // -- Tambacounda
        const tambacounda = data.find(region => region['region'] === 'Tambacounda');
        if (tambacounda && tambacounda['departements']) {
          const categoriesTambacounda = tambacounda['departements'].map((dep: any) => dep['departement']);
          const valuesTambacounda = tambacounda['departements'].map((dep: any) => dep['totalDemandes'] ?? 0);
          const pieDataTambacounda = tambacounda['departements'].map((dep: any) => ({
            name: dep['departement'],
            y: dep['totalDemandes'] ?? 0
          }));

          // Mise à jour Pie chart Tambacounda
          (this.chartOptionsPieDepartmentTambacounda.series![0] as Highcharts.SeriesPieOptions).data = pieDataTambacounda;

          // Mise à jour Line chart Tambacounda
          this.chartOptionsLineDepartmentTambacounda.xAxis = {
            ...this.chartOptionsLineDepartmentTambacounda.xAxis,
            categories: categoriesTambacounda
          };
          (this.chartOptionsLineDepartmentTambacounda.series![0] as Highcharts.SeriesLineOptions).data = valuesTambacounda;

          // Mise à jour Bar chart Tambacounda
          this.chartOptionsBarDepartmentTambacounda.xAxis = {
            ...this.chartOptionsBarDepartmentTambacounda.xAxis,
            categories: categoriesTambacounda
          };
          (this.chartOptionsBarDepartmentTambacounda.series![0] as Highcharts.SeriesColumnOptions).data = valuesTambacounda;

          this.updateFlag = true;
        }

        // -- Thies --
        const thies = data.find(region => region['region'] === 'Thiès');
        if (thies && thies['departements']) {
          const categoriesThies = thies['departements'].map((dep: any) => dep['departement']);
          const valuesThies = thies['departements'].map((dep: any) => dep['totalDemandes'] ?? 0);
          const pieDataThies = thies['departements'].map((dep: any) => ({
            name: dep['departement'],
            y: dep['totalDemandes'] ?? 0
          }));

          // Mise à jour Pie chart Thies
          (this.chartOptionsPieDepartmentThies.series![0] as Highcharts.SeriesPieOptions).data = pieDataThies;

          // Mise à jour Line chart Thies
          this.chartOptionsLineDepartmentThies.xAxis = {
            ...this.chartOptionsLineDepartmentThies.xAxis,
            categories: categoriesThies
          };
          (this.chartOptionsLineDepartmentThies.series![0] as Highcharts.SeriesLineOptions).data = valuesThies;

          // Mise à jour Bar chart Thies
          this.chartOptionsBarDepartmentThies.xAxis = {
            ...this.chartOptionsBarDepartmentThies.xAxis,
            categories: categoriesThies
          };
          (this.chartOptionsBarDepartmentThies.series![0] as Highcharts.SeriesColumnOptions).data = valuesThies;

          this.updateFlag = true;
        }
        // --- Ziguinchor ---
      const ziguinchor = data.find(region => region['region'] === 'Ziguinchor');
      if (ziguinchor && ziguinchor['departements']) {
        const categoriesZiguinchor = ziguinchor['departements'].map((dep: any) => dep['departement']);
        const valuesZiguinchor = ziguinchor['departements'].map((dep: any) => dep['totalDemandes'] ?? 0);
        const pieDataZiguinchor = ziguinchor['departements'].map((dep: any) => ({
          name: dep['departement'],
          y: dep['totalDemandes'] ?? 0
        }));

        // Mise à jour Pie chart Ziguinchor
        (this.chartOptionsPieDepartmentZiguinchor.series![0] as Highcharts.SeriesPieOptions).data = pieDataZiguinchor;

        // Mise à jour Line chart Ziguinchor
        this.chartOptionsLineDepartmentZiguinchor.xAxis = {
          ...this.chartOptionsLineDepartmentZiguinchor.xAxis,
          categories: categoriesZiguinchor
        };
        (this.chartOptionsLineDepartmentZiguinchor.series![0] as Highcharts.SeriesLineOptions).data = valuesZiguinchor;

        // Mise à jour Bar chart Ziguinchor
        this.chartOptionsBarDepartmentZiguinchor.xAxis = {
          ...this.chartOptionsBarDepartmentZiguinchor.xAxis,
          categories: categoriesZiguinchor
        };
        (this.chartOptionsBarDepartmentZiguinchor.series![0] as Highcharts.SeriesColumnOptions).data = valuesZiguinchor;

        this.updateFlag = true;
      }

});


}

// la region de Dakar
 
chartOptionsPieDepartmentDakar: Highcharts.Options = {
  chart: { type: 'pie', plotShadow: false },
  tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
  accessibility: { point: { valueSuffix: '%' } },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
                '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
                '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
        connectorColor: 'rgba(128,128,128,0.5)',
      }
    }
  },
  series: [{
    type: 'pie',
    name: 'Demandes',
    data: []
  }]
};

chartOptionsLinepieDepartmentDakar: Highcharts.Options = {
  accessibility: {
    point: { valueDescriptionFormat: '{xDescription}{separator}{value}' }
  },
  xAxis: {
    title: { text: 'Les Departements' },
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
        formatter: function () { return this.y; },
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

chartOptionsBarDepartmentDakar: Highcharts.Options = {
  chart: { type: 'column' },
  title: { text: 'Les Departements' },
  xAxis: {
    categories: [],
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
    data: [],
    colorByPoint: true,
    dataLabels: {
      enabled: true,
      style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
    }
  }]
};

getChartOptionsByTypeDakar(type: string): Highcharts.Options {
  switch (type) {
    case 'pie':
      return this.chartOptionsPieDepartmentDakar;
    case 'line':
      return this.chartOptionsLinepieDepartmentDakar;
    case 'bar':
    default:
      return this.chartOptionsBarDepartmentDakar;
  }
}



// La region de Diourbel 
chartOptionsLineDepartmentDiourbel: Highcharts.Options = {
  accessibility: {
    point: {
      valueDescriptionFormat: '{xDescription}{separator}{value}'
    }
  },
  xAxis: {
    title: { text: 'Les Départements' },
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
        formatter: function () { return this.y; },
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
    color: '#2caffe',
    dataLabels: { enabled: true }
  }]
};

chartOptionsBarDepartmentDiourbel: Highcharts.Options = {
  chart: { type: 'column' },
  title: { text: 'Les Départements' },
  xAxis: {
    categories: [],
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
    data: [],
    colorByPoint: true,
    dataLabels: {
      enabled: true,
      style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
    }
  }]
};

chartOptionsPieDepartmentDiourbel: Highcharts.Options = {
  chart: { type: 'pie', plotShadow: false },
  tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
  accessibility: { point: { valueSuffix: '%' } },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format:
          '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
          '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
          '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
        connectorColor: 'rgba(128,128,128,0.5)'
      }
    }
  },
  series: [{
    type: 'pie',
    name: 'Demandes',
    data: []
  }]
};
getChartOptionsByTypeDiourbel(type: string): Highcharts.Options {
  switch (type) {
    case 'pie': return this.chartOptionsPieDepartmentDiourbel;
    case 'line': return this.chartOptionsLineDepartmentDiourbel;
    case 'bar':
    default: return this.chartOptionsBarDepartmentDiourbel;
  }
}


// La region de fatick
chartOptionsLineDepartmentFatick: Highcharts.Options = {
  accessibility: { point: { valueDescriptionFormat: '{xDescription}{separator}{value}' } },
  xAxis: { title: { text: 'Les Départements' }, categories: [] },
  yAxis: { type: 'linear', title: { text: 'Nombre de demandes' } },
  tooltip: { headerFormat: '<b>{series.name}</b><br />', pointFormat: '{point.y}' },
  plotOptions: { line: { dataLabels: { enabled: true, formatter() { return this.y; }, style: { fontWeight: 'bold', color: '#000' }, align: 'center', verticalAlign: 'bottom', y: -5 }, enableMouseTracking: true } },
  series: [{ name: 'Demandes', type: 'line', data: [], color: '#2caffe', dataLabels: { enabled: true } }]
};

chartOptionsPieDepartmentFatick: Highcharts.Options = {
  chart: { type: 'pie', plotShadow: false },
  tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
  accessibility: { point: { valueSuffix: '%' } },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
          '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
          '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
        connectorColor: 'rgba(128,128,128,0.5)'
      }
    }
  },
  series: [{ type: 'pie', name: 'Demandes', data: [] }]
};

chartOptionsBarDepartmentFatick: Highcharts.Options = {
  chart: { type: 'column' },
  title: { text: 'Les Départements' },
  xAxis: { categories: [], title: { text: null }, gridLineWidth: 0.5, lineWidth: 0.5 },
  yAxis: { min: 0, title: { text: 'Nombre de demandes', align: 'high' }, labels: { overflow: 'justify' }, gridLineWidth: 0.5 },
  tooltip: { valueSuffix: ' demandes' },
  plotOptions: {
    column: {
      borderRadius: 10,
      groupPadding: 0.1,
      dataLabels: { enabled: true, style: { fontWeight: 'bold', color: '#000' }, inside: false }
    }
  },
  legend: { enabled: false },
  credits: { enabled: false },
  series: [{ name: 'Demandes', type: 'column', data: [], colorByPoint: true, dataLabels: { enabled: true, style: { fontSize: '13px', fontWeight: 'bold', color: '#000' } } }]
};
getChartOptionsByTypeFatick(type: string): Highcharts.Options {
  switch (type) {
    case 'pie':
      return this.chartOptionsPieDepartmentFatick;
    case 'line':
      return this.chartOptionsLineDepartmentFatick;
    case 'bar':
    default:
      return this.chartOptionsBarDepartmentFatick;
  }
}


// la region de kaffrine
chartOptionsBarDepartmentKaffrine: Highcharts.Options = {
  chart: { type: 'column' },
  title: { text: 'Les Départements de Kaffrine' },
  xAxis: {
    categories: [],
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
    data: [],
    colorByPoint: true,
    dataLabels: {
      enabled: true,
      style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
    }
  }]
};
chartOptionsPieDepartmentKaffrine: Highcharts.Options = {
  chart: { type: 'pie', plotShadow: false },
  tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
  accessibility: { point: { valueSuffix: '%' } },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format:
          '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
          '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
          '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
        connectorColor: 'rgba(128,128,128,0.5)'
      }
    }
  },
  series: [{
    type: 'pie',
    name: 'Demandes',
    data: []
  }]
};
chartOptionsLineDepartmentKaffrine: Highcharts.Options = {
  accessibility: {
    point: {
      valueDescriptionFormat: '{xDescription}{separator}{value}'
    }
  },
  xAxis: {
    title: { text: 'Les Départements' },
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
        formatter: function () { return this.y; },
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
    color: '#2caffe',
    dataLabels: { enabled: true }
  }]
};
getChartOptionsByTypeKaffrine(type: string): Highcharts.Options {
  switch (type) {
    case 'pie':
      return this.chartOptionsPieDepartmentKaffrine;
    case 'line':
      return this.chartOptionsLineDepartmentKaffrine;
    case 'bar':
    default:
      return this.chartOptionsBarDepartmentKaffrine;
  }
}

// La region de Kaoloack
chartOptionsPieDepartmentKaolack: Highcharts.Options = {
  chart: { type: 'pie', plotShadow: false },
  tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
  accessibility: { point: { valueSuffix: '%' } },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format:
          '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
          '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
          '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
        connectorColor: 'rgba(128,128,128,0.5)'
      }
    }
  },
  series: [{
    type: 'pie',
    name: 'Demandes',
    data: []
  }]
};

chartOptionsLineDepartmentKaolack: Highcharts.Options = {
  accessibility: {
    point: {
      valueDescriptionFormat: '{xDescription}{separator}{value}'
    }
  },
  xAxis: {
    title: { text: 'Les Départements' },
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
        formatter: function () { return this.y; },
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
    color: '#2caffe',
    dataLabels: { enabled: true }
  }]
};

chartOptionsBarDepartmentKaolack: Highcharts.Options = {
  chart: { type: 'column' },
  title: { text: 'Les Départements de Kaolack' },
  xAxis: {
    categories: [],
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
    data: [],
    colorByPoint: true,
    dataLabels: {
      enabled: true,
      style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
    }
  }]
};

getChartOptionsByTypeKaolack(type: string): Highcharts.Options {
  switch (type) {
    case 'pie':
      return this.chartOptionsPieDepartmentKaolack;
    case 'line':
      return this.chartOptionsLineDepartmentKaolack;
    case 'bar':
    default:
      return this.chartOptionsBarDepartmentKaolack;
  }
}


// la Region de kedougou
chartOptionsPieDepartmentKedougou: Highcharts.Options = {
  chart: { type: 'pie', plotShadow: false },
  tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
  accessibility: { point: { valueSuffix: '%' } },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format:
          '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
          '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
          '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
        connectorColor: 'rgba(128,128,128,0.5)'
      }
    }
  },
  series: [{
    type: 'pie',
    name: 'Demandes',
    data: []
  }]
};
chartOptionsLineDepartmentKedougou: Highcharts.Options = {
  accessibility: {
    point: {
      valueDescriptionFormat: '{xDescription}{separator}{value}'
    }
  },
  xAxis: {
    title: { text: 'Les Départements' },
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
        formatter: function () { return this.y; },
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
    color: '#2caffe',
    dataLabels: { enabled: true }
  }]
};
chartOptionsBarDepartmentKedougou: Highcharts.Options = {
  chart: { type: 'column' },
  title: { text: 'Les Départements de Kédougou' },
  xAxis: {
    categories: [],
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
    data: [],
    colorByPoint: true,
    dataLabels: {
      enabled: true,
      style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
    }
  }]
};
getChartOptionsByTypeKedougou(type: string): Highcharts.Options {
  switch (type) {
    case 'pie':
      return this.chartOptionsPieDepartmentKedougou;
    case 'line':
      return this.chartOptionsLineDepartmentKedougou;
    case 'bar':
    default:
      return this.chartOptionsBarDepartmentKedougou;
  }
}

// la Region de kolda
chartOptionsPieDepartmentkolda: Highcharts.Options = {
  chart: { type: 'pie', plotShadow: false },
  tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
  accessibility: { point: { valueSuffix: '%' } },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format:
          '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
          '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
          '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
        connectorColor: 'rgba(128,128,128,0.5)'
      }
    }
  },
  series: [{
    type: 'pie',
    name: 'Demandes',
    data: []
  }]
};
chartOptionsLineDepartmentkolda: Highcharts.Options = {
  accessibility: {
    point: {
      valueDescriptionFormat: '{xDescription}{separator}{value}'
    }
  },
  xAxis: {
    title: { text: 'Les Départements' },
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
        formatter: function () { return this.y; },
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
    color: '#2caffe',
    dataLabels: { enabled: true }
  }]
};
chartOptionsBarDepartmentkolda: Highcharts.Options = {
  chart: { type: 'column' },
  title: { text: 'Les Départements de Kolda' },
  xAxis: {
    categories: [],
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
    data: [],
    colorByPoint: true,
    dataLabels: {
      enabled: true,
      style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
    }
  }]
};
getChartOptionsByTypeKolda(type: string): Highcharts.Options {
  switch (type) {
    case 'pie':
      return this.chartOptionsPieDepartmentkolda;
    case 'line':
      return this.chartOptionsLineDepartmentkolda;
    case 'bar':
    default:
      return this.chartOptionsBarDepartmentkolda;
  }
}
      
// La Region de Louga
chartOptionsPieDepartmentLouga: Highcharts.Options = {
  chart: { type: 'pie', plotShadow: false },
  tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
  accessibility: { point: { valueSuffix: '%' } },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format:
          '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
          '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
          '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
        connectorColor: 'rgba(128,128,128,0.5)'
      }
    }
  },
  series: [{
    type: 'pie',
    name: 'Demandes',
    data: [] // alimenté dynamiquement
  }]
};
chartOptionsLineDepartmentLouga: Highcharts.Options = {
  accessibility: {
    point: {
      valueDescriptionFormat: '{xDescription}{separator}{value}'
    }
  },
  xAxis: {
    title: { text: 'Les Départements' },
    categories: [] // alimenté dynamiquement
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
        formatter: function () { return this.y; },
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
    color: '#2caffe',
    dataLabels: { enabled: true }
  }]
};
chartOptionsBarDepartmentLouga: Highcharts.Options = {
  chart: { type: 'column' },
  title: { text: 'Les Départements de Louga' },
  xAxis: {
    categories: [], // alimenté dynamiquement
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
    data: [],
    colorByPoint: true,
    dataLabels: {
      enabled: true,
      style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
    }
  }]
};
getChartOptionsByTypeLouga(type: string): Highcharts.Options {
  switch (type) {
    case 'pie':
      return this.chartOptionsPieDepartmentLouga;
    case 'line':
      return this.chartOptionsLineDepartmentLouga;
    case 'bar':
    default:
      return this.chartOptionsBarDepartmentLouga;
  }
}
          
// -- La region de Matam
chartOptionsBarDepartmentMatam: Highcharts.Options = {
chart: { type: 'column' },
title: { text: 'Les Départements de Matam' },
xAxis: {
  categories: ['Kanel', 'Matam', 'Ranérou'],
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
  data: [0, 0, 0],  // données dynamiques à remplacer
  colorByPoint: true,
  colors: ['#dad8d8', '#1c85e8', '#27db0a'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
  }
}]
};

chartOptionsPieDepartmentMatam: Highcharts.Options = {
chart: { type: 'pie', plotShadow: false },
tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
accessibility: { point: { valueSuffix: '%' } },
plotOptions: {
  pie: {
    allowPointSelect: true,
    cursor: 'pointer',
    dataLabels: {
      enabled: true,
      format:
        '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
        '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
        '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
      connectorColor: 'rgba(128,128,128,0.5)'
    }
  }
},
series: [{
  type: 'pie',
  name: 'Demandes',
  data: [] // données dynamiques à remplir
}]
};

chartOptionsLineDepartmentMatam: Highcharts.Options = {
chart: { type: 'column' },
title: { text: 'Les Départements de Matam' },
xAxis: {
  categories: ['Kanel', 'Matam', 'Ranérou'],
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
  type: 'line',
  data: [0, 0, 0], // données dynamiques à remplacer
  // colorByPoint: true,
  // colors: ['#dad8d8', '#1c85e8', '#27db0a'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
  }
}]
};

getChartOptionsByTypeMatam(type: string): Highcharts.Options {
  switch (type) {
    case 'pie':
      return this.chartOptionsPieDepartmentMatam;
    case 'line':
      return this.chartOptionsLineDepartmentMatam;
    case 'bar':
    default:
      return this.chartOptionsBarDepartmentMatam;
  }
}


// La region de saint-louis
// LA REGION DE SAINT-LOUIS
chartOptionsBarDepartmentSaintLouis: Highcharts.Options = {
chart: { type: 'column' },
title: { text: 'Les Départements de Saint-Louis' },
xAxis: {
  categories: ['Dagana', 'Podor', 'Saint-Louis'],
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
  data: [0, 0, 0],  // données dynamiques à remplacer
  colorByPoint: true,
  colors: ['#dad8d8', '#1c85e8', '#27db0a'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
  }
}]
};

chartOptionsPieDepartmentSaintLouis: Highcharts.Options = {
chart: { type: 'pie', plotShadow: false },
tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
accessibility: { point: { valueSuffix: '%' } },
plotOptions: {
  pie: {
    allowPointSelect: true,
    cursor: 'pointer',
    dataLabels: {
      enabled: true,
      format:
        '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
        '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
        '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
      connectorColor: 'rgba(128,128,128,0.5)'
    }
  }
},
series: [{
  type: 'pie',
  name: 'Demandes',
  data: []  // données dynamiques à remplir
}]
};

chartOptionsLineDepartmentSaintLouis: Highcharts.Options = {
chart: { type: 'line' },
title: { text: 'Les Départements de Saint-Louis' },
xAxis: {
  categories: ['Dagana', 'Podor', 'Saint-Louis'],
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
  line: {
    dataLabels: {
      enabled: true,
      style: { fontWeight: 'bold', color: '#000' }
    },
    enableMouseTracking: true
  }
},
legend: { enabled: false },
credits: { enabled: false },
series: [{
  name: 'Demandes',
  type: 'line',
  data: [0, 0, 0],  // données dynamiques à remplacer
  color: '#2caffe',
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
  }
}]
};

getChartOptionsByTypeSaintLouis(type: string): Highcharts.Options {
switch (type) {
  case 'pie':
    return this.chartOptionsPieDepartmentSaintLouis;
  case 'line':
    return this.chartOptionsLineDepartmentSaintLouis;
  case 'bar':
  default:
    return this.chartOptionsBarDepartmentSaintLouis;
}
}

// La region de sedhiou
// --- REGION DE SEDHIOU ---
chartOptionsBarDepartmentSedhiou: Highcharts.Options = {
chart: { type: 'column' },
title: { text: 'Les Départements' },
xAxis: {
  categories: ['Sédhiou', 'Bounkiling', 'Goudomp'],
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
  data: [0, 0, 0],  // données dynamiques à mettre à jour
  colorByPoint: true,
  colors: ['#dad8d8', '#1c85e8', '#27db0a'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
  }
}]
};
chartOptionsPieDepartmentSedhiou: Highcharts.Options = {
chart: { type: 'pie', plotShadow: false },
tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
accessibility: { point: { valueSuffix: '%' } },
plotOptions: {
  pie: {
    allowPointSelect: true,
    cursor: 'pointer',
    dataLabels: {
      enabled: true,
      format:
        '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
        '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
        '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
      connectorColor: 'rgba(128,128,128,0.5)'
    }
  }
},
series: [{
  type: 'pie',
  name: 'Demandes',
  data: []  // données dynamiques à mettre à jour
}]
};
chartOptionsLineDepartmentSedhiou: Highcharts.Options = {
chart: { type: 'column' },
title: { text: 'Les Départements' },
xAxis: {
  categories: ['Sédhiou', 'Bounkiling', 'Goudomp'],
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
  data: [0, 0, 0],  // données dynamiques à mettre à jour
  colorByPoint: true,
  colors: ['#dad8d8', '#1c85e8', '#27db0a'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
  }
}]
};
getChartOptionsByTypeSedhiou(type: string): Highcharts.Options {
switch (type) {
  case 'pie':
    return this.chartOptionsPieDepartmentSedhiou;
  case 'line':
    return this.chartOptionsLineDepartmentSedhiou;
  case 'bar':
  default:
    return this.chartOptionsBarDepartmentSedhiou;
}
}


// La region de tambacounda
// --- REGION DE TAMBACOUNDA ---

chartOptionsBarDepartmentTambacounda: Highcharts.Options = {
chart: { type: 'column' },
title: { text: 'Les Départements' },
xAxis: {
  categories: ['Bakel', 'Tambacounda', 'Goudiry', 'Koumpentoum'],
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
  data: [0, 0, 0, 0],  // données dynamiques à mettre à jour
  colorByPoint: true,
  colors: ['#dad8d8', '#1c85e8', '#27db0a', '#e71c13'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
  }
}]
};

chartOptionsPieDepartmentTambacounda: Highcharts.Options = {
chart: { type: 'pie', plotShadow: false },
tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
accessibility: { point: { valueSuffix: '%' } },
plotOptions: {
  pie: {
    allowPointSelect: true,
    cursor: 'pointer',
    dataLabels: {
      enabled: true,
      format:
        '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
        '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
        '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
      connectorColor: 'rgba(128,128,128,0.5)'
    }
  }
},
series: [{
  type: 'pie',
  name: 'Demandes',
  data: []  // données dynamiques à mettre à jour
}]
};

chartOptionsLineDepartmentTambacounda: Highcharts.Options = {
chart: { type: 'column' },
title: { text: 'Les Départements' },
xAxis: {
  categories: ['Bakel', 'Tambacounda', 'Goudiry', 'Koumpentoum'],
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
  data: [0, 0, 0, 0],  // données dynamiques à mettre à jour
  colorByPoint: true,
  colors: ['#dad8d8', '#1c85e8', '#27db0a', '#e71c13'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
  }
}]
};

getChartOptionsByTypeTambacounda(type: string): Highcharts.Options {
switch (type) {
  case 'pie':
    return this.chartOptionsPieDepartmentTambacounda;
  case 'line':
    return this.chartOptionsLineDepartmentTambacounda;
  case 'bar':
  default:
    return this.chartOptionsBarDepartmentTambacounda;
}
}



// la region de thies
// LA REGION DE THIES
chartOptionsBarDepartmentThies: Highcharts.Options = {
chart: { type: 'column' },
title: { text: 'Les Départements' },
xAxis: {
  categories: ['Mbour', 'Thiès', 'Rufisque', 'Tivaouane'],
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
  data: [0, 0, 0, 0],
  colorByPoint: true,
  colors: ['#dad8d8', '#1c85e8', '#27db0a', '#e71c13'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
  }
}]
};

chartOptionsPieDepartmentThies: Highcharts.Options = {
chart: { type: 'pie', plotShadow: false },
tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
accessibility: { point: { valueSuffix: '%' } },
plotOptions: {
  pie: {
    allowPointSelect: true,
    cursor: 'pointer',
    dataLabels: {
      enabled: true,
      format:
        '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
        '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
        '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
      connectorColor: 'rgba(128,128,128,0.5)'
    }
  }
},
series: [{
  type: 'pie',
  name: 'Demandes',
  data: [] // données dynamiques
}]
};

chartOptionsLineDepartmentThies: Highcharts.Options = {
chart: { type: 'column' },
title: { text: 'Les Départements' },
xAxis: {
  categories: ['Mbour', 'Thiès', 'Rufisque', 'Tivaouane'],
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
  data: [0, 0, 0, 0],
  colorByPoint: true,
  colors: ['#dad8d8', '#1c85e8', '#27db0a', '#e71c13'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
  }
}]
};

getChartOptionsByTypeThies(type: string): Highcharts.Options {
switch (type) {
  case 'pie':
    return this.chartOptionsPieDepartmentThies;
  case 'line':
    return this.chartOptionsLineDepartmentThies;
  case 'bar':
  default:
    return this.chartOptionsBarDepartmentThies;
}
}


// la region de ziguinchor
// LA REGION DE ZIGUINCHOR
chartOptionsBarDepartmentZiguinchor: Highcharts.Options = {
chart: { type: 'column' },
title: { text: 'Les Départements' },
xAxis: {
  categories: ['Bignona', 'Oussouye', 'Ziguinchor'],
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
  data: [0, 0, 0],
  colorByPoint: true,
  colors: ['#dad8d8', '#1c85e8', '#27db0a'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
  }
}]
};

chartOptionsPieDepartmentZiguinchor: Highcharts.Options = {
chart: { type: 'pie', plotShadow: false },
tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
accessibility: { point: { valueSuffix: '%' } },
plotOptions: {
  pie: {
    allowPointSelect: true,
    cursor: 'pointer',
    dataLabels: {
      enabled: true,
      format:
        '<span style="font-size: 1.2em"><b>{point.name}</b></span><br>' +
        '<span style="opacity: 0.6">{point.percentage:.1f} %</span><br>' +
        '<span style="opacity: 0.8; font-weight: bold;">{point.y}</span>',
      connectorColor: 'rgba(128,128,128,0.5)'
    }
  }
},
series: [{
  type: 'pie',
  name: 'Demandes',
  data: [] // données dynamiques
}]
};

chartOptionsLineDepartmentZiguinchor: Highcharts.Options = {
chart: { type: 'column' },
title: { text: 'Les Départements' },
xAxis: {
  categories: ['Bignona', 'Oussouye', 'Ziguinchor'],
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
  data: [0, 0, 0],
  colorByPoint: true,
  colors: ['#dad8d8', '#1c85e8', '#27db0a'],
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px', fontWeight: 'bold', color: '#000' }
  }
}]
};

getChartOptionsByTypeZiguinchor(type: string): Highcharts.Options {
switch (type) {
  case 'pie':
    return this.chartOptionsPieDepartmentZiguinchor;
  case 'line':
    return this.chartOptionsLineDepartmentZiguinchor;
  case 'bar':
  default:
    return this.chartOptionsBarDepartmentZiguinchor;
}
}




  


}