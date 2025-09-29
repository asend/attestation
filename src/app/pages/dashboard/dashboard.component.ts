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
loading = false;

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
  sub!: Subscription;



intervals: { [id: number]: any } = {};

 


  constructor(private demandeService: DemandeService, 
                private dashbordService: DashbordService, 
                   private auth: UtilisateurService,
                     private router: Router,
                     private socketService: WebsocketService) { }

  ngOnInit(): void {
    setInterval(() => {
      window.location.reload();
    }, 180000);
  
    this.sub = this.socketService.onMessage().subscribe(msg => {
      console.log("msg" + msg);
    });
    this.getAllDemande();
    this.initialize();  
  }

  // getAllDemande() {
  //   this.isLoading = true;
  //   this.demandeService.findAllDemande({ statut: '2cad843e-b6fd-4b85-815d-4bc2a499972d' }).subscribe({
  //     next: (data) => {
  //       console.log("Données récupérées :", data);
  
  //       // Tri par date et heure décroissante (les plus récentes en premier)
  //       this.demandes = data.sort((a, b) => {
  //         const dateA = new Date(a.datedemande!); // suppose que le champ s'appelle 'date'
  //         const dateB = new Date(b.datedemande!);
  //         return dateB.getTime() - dateA.getTime(); // décroissant
  //       });
  
  //       this.isLoading = false;
  //     },
  //     error: () => {
  //       this.isLoading = false;
  //     }
  //   });
  // }
  
 
  getAllDemande() {
      this.isLoading = true;
    this.demandeService.findAllDemande({ statut: '2cad843e-b6fd-4b85-815d-4bc2a499972d' }).subscribe({
      next: (data) => {
        console.log("Données récupérées :", data);  // <-- Affiche toutes les données dans la console

        this.demandes = data;
        this.isLoading = false;
        
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  
  private async initialize() {
    this.isLoadingCard = true;
  
    try {
      const stats = await lastValueFrom(this.demandeService.getStatistiquesDemandes());
  
      this.ntDemande = stats.totalGlobal;
  
      // Réinitialiser
      this.naDemande = 0;
      this.neDemande = 0;
      this.nrDemande = 0;
  
      for (const item of stats.parStatut) {
        const statut = item.statut.trim().toLowerCase();
        console.log('Statut reçu :', statut);
  
        switch (statut) {
          case '4d08a09a-405a-4e67-bdb7-243f661e56cd':
            this.naDemande = item.total;
            break;
          case '2cad843e-b6fd-4b85-815d-4bc2a499972d':
            this.neDemande = item.total;
            break;
          case '933ae9b3-c8b8-4d6f-ba5f-b5c47e0efbb1':
            this.nrDemande = item.total;
            break;
        }
      }
  
      this.statisques = [
        {
          title: "Toutes les demandes",
          nombre: this.ntDemande,
          slug: "all",
          textcolor: "clred",
          icons: "icontout"
        },
        {
          title: "Demandes en cours",
          nombre: this.neDemande,
          slug: "2cad843e-b6fd-4b85-815d-4bc2a499972d",
          textcolor: "clgreen",
          statuscolor: "encourblue",
          icons: "iconencours"
        },
        {
          title: "Demandes approuvées",
          nombre: this.naDemande,
          slug: "4d08a09a-405a-4e67-bdb7-243f661e56cd",
          textcolor: "clwhite",
          statuscolor: "approuedgreen",
          icons: "iconapprouved"
        },
        {
          title: "Demandes rejetées",
          nombre: this.nrDemande,
          slug: "933ae9b3-c8b8-4d6f-ba5f-b5c47e0efbb1",
          textcolor: "clyellow",
          statuscolor: "rejectred",
          icons: "iconrejected"
        }
      ];
  
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques", error);
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
      // ⚡ Ici on appelle le traducteur
      this.titre = "La liste des demandes " + this.getStatutTitre(val);
  
      // Définition couleur selon statut
      switch (val.toLowerCase()) {
        case "2cad843e-b6fd-4b85-815d-4bc2a499972d":
          this.currentStatutColor = "text-primary";  // bleu
          break;
        case "4d08a09a-405a-4e67-bdb7-243f661e56cd":
          this.currentStatutColor = "text-success";  // vert
          break;
        case "933ae9b3-c8b8-4d6f-ba5f-b5c47e0efbb1":
          this.currentStatutColor = "text-danger";   // rouge
          break;
        default:
          this.currentStatutColor = "text-secondary";
      }
  
      this.demandeService.findAllDemande({ statut: val }).subscribe({
        next: (response: any) => {
          this.demandes = response;
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      });
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

  getStatutTitre(statut: string): string {
    switch (statut) {
      case '2cad843e-b6fd-4b85-815d-4bc2a499972d':
        return 'en cours';
      case '4d08a09a-405a-4e67-bdb7-243f661e56cd':
        return 'Approuvées';
      case '933ae9b3-c8b8-4d6f-ba5f-b5c47e0efbb1':
        return 'Rejetées';
      default:
        return statut;
    }
  }


  getStatutLabel(statut: string): string {
    switch (statut) {
      case '2cad843e-b6fd-4b85-815d-4bc2a499972d':
        return 'en cours';
      case '4d08a09a-405a-4e67-bdb7-243f661e56cd':
        return 'Approuvée';
      case '933ae9b3-c8b8-4d6f-ba5f-b5c47e0efbb1':
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
    


    mettreEnCours(demandeId: number): void {
      this.demandeService.mettreEnCours(demandeId).subscribe({
        next: (res) => {
          // Mettre à jour directement la demande dans le tableau
          const index = this.demandes.findIndex(d => d.id === demandeId);
          if (index !== -1) {
            this.demandes[index] = {
              ...this.demandes[index],
              statut: 'en cours',
              attestaionName: '',
              motifrejet: ''
            };
          }
          alert("✅ Demande mise en cours avec succès");
            window.location.reload();

          this.getAllDemande();
    
          console.log(`✅ ${res}`); // affiche le texte renvoyé par le backend
        },
        error: (err) => {
          console.error('Erreur inattendue', err);
        }
      });
    }
    

    // mettreEnCours(demandeId: number): void {
    //   this.demandeService.mettreEnCours(demandeId).subscribe({
    //     next: (res) => {
    //       // Mettre à jour directement la demande dans le tableau
    //       const index = this.demandes.findIndex(d => d.id === demandeId);
    //       if (index !== -1) {
    //         this.demandes[index] = {
    //           ...this.demandes[index],
    //           statut: 'en cours',
    //           attestaionName: '',
    //           motifrejet: ''
    //         };
    //       }
    
    //       // Affichage non bloquant (optionnel)
    //       console.log(`✅ Demande ${demandeId} mise en cours avec succès !`);
    //       // ou utiliser un toast Angular à la place de alert
    //     },
    //     error: (err) => {
    //       console.error(`❌ Erreur lors de la mise en cours de la demande ${demandeId}`, err);
    //     }
    //   });
    // }
    





  
  }
  
  
