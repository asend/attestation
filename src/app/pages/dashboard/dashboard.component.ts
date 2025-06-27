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


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private timerIntervals: { [id: number]: any } = {}; // pour gérer plusieurs chronos par ID
  elapsedTimes: { [id: number]: string } = {};
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
 


  constructor(private demandeService: DemandeService, private dashbordService: DashbordService, private auth: UtilisateurService, private router: Router) { }

  ngOnInit(): void {
    setInterval(() => {
      window.location.reload();
    }, 180000);

    this.getAllDemande();   
  }



  
  formatElapsedTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }
  
  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  
  
  startChrono(demande: any) {
    // Ne relance pas si déjà lancé
    if (this.timerIntervals[demande.id]) return;
  
    // Vérifie que tempsEcoule existe
    if (!demande.tempsEcoule) return;
  
    const startTime = new Date(demande.tempsEcoule);
  
    this.timerIntervals[demande.id] = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = now - startTime.getTime(); // différence en ms
      demande.elapsedTime = this.formatElapsedTime(elapsed);
      this.elapsedTimes[demande.id] = demande.elapsedTime;
    }, 1000);
  }
  
  
  stopChrono(demande: any) {
    const interval = this.timerIntervals[demande.id];
    if (interval) {
      clearInterval(interval);
      delete this.timerIntervals[demande.id];
    }
    demande.elapsedTime = '';
    this.elapsedTimes[demande.id] = '';
  }
  
  // Récupérer toutes les demandes et lancer/arrêter les chronos en fonction du statut
  
  

  getAllDemande(){
    this.isLoading = true;
   this.initialize();
    this.demandeService.findAllDemande({statut: 'cours'}).subscribe({
      next:(data)=>{
        this.demandes = data;
        this.isLoading = false;
      }
    })
  }

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
      // Gérer erreur ici si besoin
    } finally {
      this.isLoadingCard = false;
    }
  }
  
  // private async initialize(){

  //   this.naDemande = await lastValueFrom(
  //     this.dashbordService.getAppouved()
  //   );

  //   this.neDemande = await lastValueFrom(
  //     this.dashbordService.getCours()
  //   )

  //   this.ntDemande = await lastValueFrom(
  //     this.dashbordService.getCount()
  //   )

  //   this.nrDemande = await lastValueFrom(
  //     this.dashbordService.getRejected()
  //   )

  //   this.statisques = [
  //     {
  //       title: "Toutes les demandes",
  //       nombre: this.ntDemande,
  //       slug: "all",
  //       textcolor: "clred",
  //       icons:"icontout",

  //     } ,
  //     {
  //       title: "Demandes en cours",
  //       nombre: this.neDemande,
  //       slug: "Cours",
  //       textcolor: "clgreen",
  //       statuscolor: "encourblue",
  //       icons: "iconencours"
  //     },
  //     {
  //       title: "Demandes approuvées",
  //       nombre: this.naDemande,
  //       slug: "Approuvée",
  //       textcolor: "clwhite",
  //       statuscolor: "approuedgreen",
  //       icons:"iconapprouved"
  //     },
  //     {
  //       title: "Demandes rejetées",
  //       nombre: this.nrDemande,
  //       slug: "Rejetée",
  //       textcolor: "clyellow",
  //       statuscolor: "rejectred",
  //       icons:"iconrejected"
  //     }
  //   ]
  // }

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

  // onStatut(val: string) {
  //   this.isLoading = true;
  //   if(val==="all"){
  //     this.titre = "La liste des demandes";
  //     this.demandeService.findDemandeActif().subscribe((response:any)=>{
  //       this.demandes = response;
  //       this.isLoading = false;
  //     })
  //   }else{
  //     this.titre = "La liste des demandes "+val;
  //     this.demandeService.findAllDemande({"statut": val}).subscribe((response:any)=>{
  //       this.demandes = response; 
  //       this.isLoading = false;      
  //     })
  //     console.log(val);
  //   }
  // }


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
  
  
}
