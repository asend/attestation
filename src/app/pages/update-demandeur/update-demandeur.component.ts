import {Component, OnInit, ViewChild} from '@angular/core';
import {DemandeurDto} from "../../services/models/demandeur-dto";
import {DemandeurService} from "../../services/services/demandeur.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {ApiConfiguration} from "../../services/api-configuration";
import {ImageService} from "../../auth/service/image.service";
import Swal from "sweetalert2";
import { RegionDepartementService } from 'src/app/services/services/region-departement.service';

@Component({
  selector: 'app-update-demandeur',
  templateUrl: './update-demandeur.component.html',
  styleUrls: ['./update-demandeur.component.css']
})
export class UpdateDemandeurComponent implements OnInit {

  currentDemandeur: DemandeurDto = {adresse: "", lieudenaissance: "", sexe: "", telephone: "", region: "", departement: ""}
  // urlSafe: any;
  loading: boolean = false;

  myImage!: string;
  uploadedImage!: File;
  isImageUpdated: Boolean=false;


  regions: any[] = [];
  departements: any[] = [];
  isSelect: boolean = false;

  uploadedImages!: File[];

  // urlimage: string = "http://localhost:8080";
  urlimage: string = 'https://api.demarche.mfprsp.com';


  constructor(private demandeurService: DemandeurService, private ac: ActivatedRoute,
              public santizer: DomSanitizer, private apiUrl: ApiConfiguration, private imageService: ImageService, private router: Router,
              private regionDepartementService: RegionDepartementService
              ) { }

  ngOnInit(): void {
    this.demandeurService.getByNin1({nin: localStorage.getItem("nin") as string}).subscribe({
      next:(data)=>{
        this.currentDemandeur = data;
        // this.urlSafe = this.santizer.bypassSecurityTrustResourceUrl(this.apiUrl.rootUrl+"/api/uploads/loadfromFS/"+this.currentDemandeur.id);
        console.log(data);
      }
      
    })
    this.loadRegions();


    
  }

  onUpdate() {
    this.loading = true;
    console.log("image " + this.uploadedImage);
    this.demandeurService.updateDemandeur({ body: this.currentDemandeur }).subscribe({
      next: (data) => {
        this.loading = false;
        if (this.uploadedImage != undefined) {
          console.log("size " + this.uploadedImage.size);
          for (let index = 0; index < this.uploadedImages.length; index++) {
            // Si vous n'avez pas besoin de base64, passez une chaîne vide
            this.imageService.uploadImageDemandeur(this.uploadedImages[index], "", Number(data)).subscribe({
              next: (response) => {
                this.router.navigate(['mes-demandes', this.currentDemandeur.id]);
              },
              error: (err: any) => {
                this.router.navigate(['mes-demandes', this.currentDemandeur.id]);
              }
            });
          }
        }
        this.router.navigate(['mes-demandes', this.currentDemandeur.id]);
      },
      error: (err: any) => {
        this.router.navigate(['mes-demandes', this.currentDemandeur.id]);
      }
    });
  }
  

  annuler(){
    this.router.navigate(['mes-demandes', this.currentDemandeur.id])
  }



  listDemande() {
    this.demandeurService.getByNin1({nin: localStorage.getItem("nin") as string}).subscribe({
      next:(data)=>{
        this.router.navigate(['/mes-demandes', data.id])
      }
    })
  }



  onImageUploads($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.uploadedImages = Array.from(target.files); // Conversion en tableau
      console.log("Nombre de fichiers sélectionnés :", this.uploadedImages.length);
  
      // Assurez-vous que `uploadedImages` contient au moins un fichier
      if (this.uploadedImages.length > 0) {
        this.uploadedImage = this.uploadedImages[0]; // Premier fichier sélectionné
  
        // Aperçu de l'image
        this.isImageUpdated = true;
        const reader = new FileReader();
        reader.readAsDataURL(this.uploadedImage);
        reader.onload = () => {
          this.myImage = reader.result as string;
        };
  
        console.log("Fichier prêt à être uploadé :", this.uploadedImage.name);
      }
    } else {
      console.warn("Aucun fichier sélectionné");
    }
  }

  loadRegions() {
    this.regionDepartementService.getAllRegions().subscribe(
      (data) => {
        this.regions = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des régions', error);
      }
    );
  }

  onRegionSelected(event: any) {
    const regionId = event.target.value;
    if (regionId) {
      this.isSelect = true;
      this.regionDepartementService.getDepartementsByRegionId(regionId).subscribe(
        (data) => {
          this.departements = data;
        },
        (error) => {
          console.error('Erreur lors du chargement des départements', error);
        }
      );
    } else {
      this.isSelect = false;
      this.departements = [];
    }
  }
  

}
