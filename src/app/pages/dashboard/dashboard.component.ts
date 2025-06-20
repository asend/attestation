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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentDemande: DemandeDto={};
  urlSafe: any;
  searchtext: any;

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

  getAllDemande(){
   this.initialize();
    this.demandeService.findAllDemande({statut: 'cours'}).subscribe({
      next:(data)=>{
        this.demandes = data;
      }
    })
  }

  private async initialize(){

    this.naDemande = await lastValueFrom(
      this.dashbordService.getAppouved()
    );

    this.neDemande = await lastValueFrom(
      this.dashbordService.getCours()
    )

    this.ntDemande = await lastValueFrom(
      this.dashbordService.getCount()
    )

    this.nrDemande = await lastValueFrom(
      this.dashbordService.getRejected()
    )

    this.statisques = [
      {
        title: "Toutes les demandes",
        nombre: this.ntDemande,
        // infoStyle: "bg-info",
        slug: "all",
        textcolor: "clred",
        icons:"icontout"
      } ,
      {
        title: "Demandes en cours",
        nombre: this.neDemande,
        // infoStyle: "bg-warning",
        slug: "Cours",
        textcolor: "clgreen",
        statuscolor: "encourblue",
        icons: "iconencours"
      },
      {
        title: "Demandes approuvées",
        nombre: this.naDemande,
        // infoStyle: "bg-success",
        slug: "Approuvée",
        textcolor: "clwhite",
        statuscolor: "approuedgreen",
        icons:"iconapprouved"
      },
      {
        title: "Demandes rejetées",
        nombre: this.nrDemande,
        // infoStyle: "bg-danger",
        slug: "Rejetée",
        textcolor: "clyellow",
        statuscolor: "rejectred",
        icons:"iconrejected"
      }
    ]
  }
  onStatut(val: string) {
    if(val==="all"){
      this.titre = "La liste des demandes";
      this.demandeService.findDemandeActif().subscribe((response:any)=>{
        this.demandes = response;
      })
    }else{
      this.titre = "La liste des demandes "+val;
      this.demandeService.findAllDemande({"statut": val}).subscribe((response:any)=>{
        this.demandes = response;       
      })
      console.log(val);
    }
  }

  // Search() {
  //   if (this.name === "") {
  //     this.ngOnInit();
  //   } else {
  //     const filteredDemandes = this.demandes.filter(r => {
  //       return (
  //         r.statut?.toLocaleLowerCase().includes(this.name.toLocaleLowerCase()) ||
  //         r.demandeurDTO?.prenom?.toLocaleLowerCase().includes(this.name.toLocaleLowerCase()) ||
  //         r.demandeurDTO?.nom?.toLocaleLowerCase().includes(this.name.toLocaleLowerCase()) ||
  //         r.demandeurDTO?.telephone?.toLocaleLowerCase().includes(this.name.toLocaleLowerCase()) ||
  //         r.demandeurDTO?.datedenaissance?.toLocaleLowerCase().includes(this.name.toLocaleLowerCase()) ||
  //         r.demandeurDTO?.lieudenaissance?.toLocaleLowerCase().includes(this.name.toLocaleLowerCase()) ||
  //         r.demandeurDTO?.nin?.toLocaleLowerCase().includes(this.name.toLocaleLowerCase())

  //       );
  //     });
  //     this.demandes = filteredDemandes;
  //     this.noDataFound = this.demandes.length === 0;
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
  
}
