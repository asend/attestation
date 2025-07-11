import { Component, OnInit } from '@angular/core';
import {DemandeDto} from "../../services/models/demande-dto";
import {DemandeService} from "../../services/services/demande.service";
import {getAllDemande} from "../../services/fn/demande/get-all-demande";
import {DashbordService} from "../../services/services/dashbord.service";
import {InfoStatistique} from "../card/card.component";
import {lastValueFrom} from "rxjs";
import { UtilisateurService } from 'src/app/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { interval, Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/websocket.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  timers: { [id: number]: any } = {};
displayTimes: { [id: number]: string } = {};
startTimestamps: { [id: number]: number } = {};


  timerStartTimes: { [id: number]: number } = {};
elapsedTimes: { [id: number]: string } = {};


  loadingMatriculeSolde: boolean = false;

  displayTime = '00:00:00';
  intervalId: any = null;
  startTimestamp: number | null = null; 
  isRunning = false;

  readonly STORAGE_KEY = 'chronoStartTimestamp';
  readonly STOPPED_TIME_KEY = 'chronoStoppedTime';


  private timerIntervals: { [id: number]: any } = {}; 
  private timerSub!: Subscription;

  

  currentDemande: DemandeDto={};
  urlSafe: any;
  searchtext: any;

  isLoading: boolean = false;
  isLoadingCard: boolean = false;


  p:  any=1;
  itemsPerPages!:number;
  totalItems: any;
  demandes: DemandeDto[] = [];

  aDemande: DemandeDto[]=[];

  statisques: Array<InfoStatistique> = [];
  naDemande: any;
  neDemande: any;
  ntDemande: any;
  nrDemande: any;
  titre = "La liste des demandes";
  currentStatutColor = "text-dark";

  name: any;

 itemsPerPage: number = 10;

 noDataFound: boolean = false;
 
 message = '';
 messages: string[] = [];
 private sub!: Subscription;

 


  constructor(private demandeService: DemandeService, 
                private dashbordService: DashbordService, 
                   private auth: UtilisateurService,
                     private router: Router,
                     private socketService: WebsocketService) { }

  ngOnInit(): void {
    // setInterval(() => {
    //   window.location.reload();
    // }, 180000);
  
    // this.getAllDemande();
    this.getAllDemande();   
    this.sub = this.socketService.onMessage().subscribe(msg => {
      console.log("msg" + msg);
      
      this.getAllDemande();
      
    });
     
  }

  getAllDemande() {
    this.isLoading = true;
    this.demandeService.findAllDemande({ statut: 'cours' }).subscribe({
      next: (data) => {
        const newDemandes = data;
  
        const existingIds = Object.keys(this.timers).map(Number);
  
        const currentIds = newDemandes
          .map(d => d.id)
          .filter((id): id is number => typeof id === 'number'); // ✅ Filtrage
  
        // Démarrer les timers pour les nouvelles demandes
        currentIds.forEach(id => {
          if (!this.timers[id]) {
            const savedStart = localStorage.getItem(`start_${id}`);
            if (savedStart) {
              this.startTimestamps[id] = Number(savedStart);
            } else {
              this.startTimestamps[id] = Date.now();
              localStorage.setItem(`start_${id}`, `${this.startTimestamps[id]}`);
            }
            this.startTimerForDemande(id);
          }
        });
  
        // Arrêter les timers pour les demandes qui ne sont plus présentes
        existingIds.forEach(id => {
          if (!currentIds.includes(id)) {
            this.stopTimerForDemande(id);
          }
        });
  
        this.demandes = newDemandes;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  
 
  // getAllDemande() {
  //   this.isLoading = true;
  //   this.initialize();
  //   this.demandeService.findAllDemande({ statut: 'cours' }).subscribe({
  //     next: (data) => {
  //       this.demandes = data;
  //       this.isLoading = false;
  //     },
  //     error: () => {
  //       this.isLoading = false;
  //     }
  //   });
  // }
  

  private async initialize() {
    this.isLoadingCard = true;
  
    try {
      this.naDemande = await lastValueFrom(this.dashbordService.getAppouved());
      this.neDemande = await lastValueFrom(this.dashbordService.getCours());
      this.ntDemande = await lastValueFrom(this.dashbordService.getCount());
      this.nrDemande = await lastValueFrom(this.dashbordService.getRejected());
  
      this.statisques = [
        {
          title: "Toutes les demandes",
          nombre: this.ntDemande,
          slug: "all",
          textcolor: "clred",
          icons:"icontout"
        },
        {
          title: "Demandes en cours",
          nombre: this.neDemande,
          slug: "cours",
          textcolor: "clgreen",
          statuscolor: "encourblue",
          icons: "iconencours"
        },
        {
          title: "Demandes approuvées",
          nombre: this.naDemande,
          slug: "approuvée",
          textcolor: "clwhite",
          statuscolor: "approuedgreen",
          icons:"iconapprouved"
        },
        {
          title: "Demandes rejetées",
          nombre: this.nrDemande,
          slug: "rejetée",
          textcolor: "clyellow",
          statuscolor: "rejectred",
          icons:"iconrejected"
        }
      ];
    } catch (error) {
    } finally {
      this.isLoadingCard = false;
    }
  }



onStatut(val: string) {
  this.isLoading = true;
  
  if (val === "all") {
    this.titre = "La liste des demandes";
    this.currentStatutColor = "text-dark";
    this.demandeService.findDemandeActif().subscribe({
      next: (response: any) => {
        this.demandes = response;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  } else {
    this.titre = "La liste des demandes " + val;

    // Définition couleur selon statut
    switch (val.toLowerCase()) {
      case "cours":
        this.currentStatutColor = "text-primary";  // bleu
        break;
      case "approuvée":
        this.currentStatutColor = "text-success";  // vert
        break;
      case "rejetée":
        this.currentStatutColor = "text-danger";   // rouge
        break;
      default:
        this.currentStatutColor = "text-secondary"; // gris
    }

    this.demandeService.findAllDemande({ statut: val }).subscribe({
      next: (response: any) => {
        this.demandes = response;
        this.isLoading = false;

        
      },
      error: () => { this.isLoading = false; }
    });

    console.log(val);
  }
}

 
  refresh(){
    window.location.reload();
  }

  onDelete(id: number| undefined) {
    const btn = document.getElementById('btn') as HTMLButtonElement | null
    btn?.removeAttribute('disabled')

    console.log("ok")
    this.demandeService.annuler({id: Number(id)}).subscribe({
      next:(data)=>{
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Votre demande est annulée.",
          showConfirmButton: false,
          timer: 2000
        },)
      }
    })
  }
  clickMethod(id: number) {
    const message = "Souhaitez-vous supprimée votre demande en cours de traitement ? "; 
    if (confirm(message)) {
      this.onDelete(id);
      window.location.reload();
    } else {
      this.router.navigate(['mes-demandes']);
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'cours':
        return 'en cours';
      case 'approuvée':
        return 'Approuvée';
      case 'rejetée':
        return 'Rejetée';
      default:
        return statut;
    }
  }
  

  UpdateTempsEcouler(id: number) {
    this.demandeService.updateTempsEcoule(id ,this.currentDemande.tempsEcoule as string).subscribe({
      next: (response) => {
        console.log(response);
        console.log("temps ecoulee" + this.currentDemande.tempsEcoule);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du motif de rejet', err);
      }
    });
  }

  // startTimerForDemande(id: number) {
  //   if (this.timers[id]) return;
  
  //   this.timers[id] = setInterval(() => {
  //     const now = Date.now();
  //     const elapsedSeconds = Math.floor((now - this.startTimestamps[id]) / 1000);
  //     this.displayTimes[id] = this.formatTime(elapsedSeconds);
  //   }, 1000);
  // }

  stopTimerForDemande(id: number) {
    if (this.timers[id]) {
      clearInterval(this.timers[id]);
      delete this.timers[id];
    }
  
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - this.startTimestamps[id]) / 1000);
    delete this.startTimestamps[id];
    localStorage.removeItem(`start_${id}`);
  
    const baseDate = new Date(0);
    baseDate.setSeconds(elapsedSeconds);
    const localDatetime = this.toDatetimeLocal(baseDate);
  
    this.currentDemande.tempsEcoule = localDatetime;
  
    this.UpdateTempsEcouler(id);
  }
  startTimerForDemande(id: number | undefined) {
    if (typeof id !== 'number') return; // ⚠ sécurité
  
    if (this.timers[id]) return;
  
    this.timers[id] = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - this.startTimestamps[id]) / 1000);
      this.displayTimes[id] = this.formatTime(elapsedSeconds);
    }, 1000);
  }
  
  // startTimerForDemande(id: number) {
  //   if (this.timers[id]) return; // ✅ Ne démarre pas si déjà en cours
  
  //   this.timers[id] = setInterval(() => {
  //     const now = Date.now();
  //     const elapsedSeconds = Math.floor((now - this.startTimestamps[id]) / 1000);
  //     this.displayTimes[id] = this.formatTime(elapsedSeconds);
  //   }, 1000);
  // }
  
  
  
    toDatetimeLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`; 
    }
    


  updateDisplay() {
    if (!this.startTimestamp) {
      this.displayTime = '00:00:00';
      return;
    }
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - this.startTimestamp) / 1000);
    this.displayTime = this.formatTime(elapsedSeconds);
  }



  formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  }

  // ngOnDestroy() {
  //   if (this.intervalId) {
  //     clearInterval(this.intervalId);
  //   }
  // }


  traite(id: number){
    this.stopTimerForDemande(id);
    this.UpdateTempsEcouler(id);
    this.router.navigate(['/verification', id]);

  }
  

  
  }
  
  
