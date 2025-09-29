import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from 'src/app/auth/service/image.service';
import { ApiConfiguration } from 'src/app/services/api-configuration';
import { DemandeDto, Demandeur, DemandeurDto } from 'src/app/services/models';
import { AttestationService, DemandeService, DemandeurService, FileuploadService, MailService, SendMailService } from 'src/app/services/services';
import { RegionDepartementService } from 'src/app/services/services/region-departement.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-udpdate-demandeur-utilisateur',
  templateUrl: './udpdate-demandeur-utilisateur.component.html',
  styleUrls: ['./udpdate-demandeur-utilisateur.component.css']
})
export class UdpdateDemandeurUtilisateurComponent implements OnInit {
  uploadedImages!: File[];
 
  currentDemande: DemandeDto={ };
  urlSafe: any;
  regions: any[] = [];
  departements: any[] = [];
  isSelect: boolean = false;

  // urlimage: string = "http://localhost:8080";
  urlimage: string = environment.apiUrl;

  // urlimage: string = 'https://api.demarche.mfprsp.com';


  loading: boolean = false;
  loadingReject: boolean = false;

  currentDemandeur: DemandeurDto = {adresse: "", lieudenaissance: "", sexe: "", telephone: "", datedenaissance: ""}

  myImage!: string;
  uploadedImage!: File;
  isImageUpdated: Boolean=false;

  constructor(
    private ac: ActivatedRoute,private demandeService: DemandeService,private router: Router, private mailService: SendMailService,private demandeurService: DemandeurService,
    private attestationService: AttestationService,public santizer: DomSanitizer,private fileUpladService: FileuploadService,private imageService: ImageService,
    private apiUrl: ApiConfiguration,private mailServices: MailService,  private regionDepartementService: RegionDepartementService) { }
  
  
// ngOnInit(): void {
//     this.demandeService.getById2({id: this.ac.snapshot.params['id']}).subscribe({
//       next:(data)=>{
//         this.currentDemande = data
//         this.urlSafe = this.santizer.bypassSecurityTrustResourceUrl(this.apiUrl.rootUrl+"/api/uploads/loadfromFS/"+this.currentDemande.demandeurDTO?.id);
//       }
//     })
//     this.demandeurService.getById1({id: this.ac.snapshot.params['id']}).subscribe({
//       next:(data)=>{
//         this.currentDemandeur = data;
//         this.urlSafe = this.santizer.bypassSecurityTrustResourceUrl(this.apiUrl.rootUrl+"/api/uploads/loadfromFS/"+this.currentDemande.demandeurDTO?.id);

//       }
//     })
//     this.loadRegions();
    
    

//   }
ngOnInit(): void {
  this.demandeService.getById2({id: this.ac.snapshot.params['id']}).subscribe({
    next: (data) => {
      this.currentDemande = data;
      this.urlSafe = this.santizer.bypassSecurityTrustResourceUrl(
        this.apiUrl.rootUrl + "/api/uploads/loadfromFS/" + this.currentDemande.demandeurDTO?.id
      );
    }
  });

  this.demandeurService.getById1({id: this.ac.snapshot.params['id']}).subscribe({
    next: (data) => {
      this.currentDemandeur = data;

      // 🔽 Si le demandeur a déjà une région, on charge ses départements
      if (this.currentDemandeur.region) {
        this.regionDepartementService.getDepartementsByRegionId(Number(this.currentDemandeur.region)).subscribe({
          next: (departements) => {
            // this.departements = departements;
            this.currentDemandeur.departement = this.currentDemandeur.departement?.toString();

            this.isSelect = true;
            // this.currentDemandeur.departement = Number(this.currentDemandeur.departement);
          },
          error: (err) => {
            console.error("Erreur lors du chargement des départements initiaux :", err);
          }
        });
      }

      this.urlSafe = this.santizer.bypassSecurityTrustResourceUrl(
        this.apiUrl.rootUrl + "/api/uploads/loadfromFS/" + this.currentDemande.demandeurDTO?.id
      );
    }
  });

  // Chargement des régions
  this.loadRegions();
}



formatDateToDDMMYYYY(dateStr: string): string {
  const date = new Date(dateStr);
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}



onUpdate() {
  this.loading = true;

  // ✅ Formatage de la date
  if (this.currentDemandeur.datedenaissance) {
    this.currentDemandeur.datedenaissance = this.formatDateToDDMMYYYY(this.currentDemandeur.datedenaissance);
  }

  console.log("Image sélectionnée :", this.uploadedImage);
  console.log("Payload mis à jour :", this.currentDemandeur);

  this.demandeurService.updateDemandeurUser(this.currentDemandeur).subscribe({
    next: (data) => {
      this.loading = false;

      if (this.uploadedImage) {
        console.log("Taille fichier image : " + this.uploadedImage.size);
        this.imageService.uploadImageFS(this.uploadedImage, Number(this.currentDemandeur.id)).subscribe({
          next: () => {
            Swal.fire({
              title: 'Mise à jour réussie !',
              text: 'Super, Modification réussie',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['mes-demandes', this.currentDemandeur.id]);
            });
            
          },
          error: () => {
            Swal.fire({
              title: 'Erreur de modification !',
              text: 'Veuillez réessayer.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      } else {
        Swal.fire({
          title: 'Mise à jour réussie !',
          text: 'Les informations ont été mises à jour avec succès.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['mes-demandes', this.currentDemandeur.id]);
        });
      };
    },
    error: () => {
      this.loading = false;
      Swal.fire({
        title: 'Erreur lors de la mise à jour',
        text: 'Veuillez réessayer.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });
}



 
annuler(){
  this.router.navigate(['mes-demandes', this.currentDemandeur.id])
}


  onImageUpload($event: Event) {
    // @ts-ignore
    if(event.target.files && event.target.files.length) {
      // @ts-ignore
      this.uploadedImage = event.target.files[0];
      // @ts-ignore
      if (this.uploadedImage.size>2000000){
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Veuillez choisir un fichier de moins de 2Mo.",
          showConfirmButton: false,
          timer: 6000
        })

        // @ts-ignore
        document.getElementById("file").value= null;
        // @ts-ignore
        document.getElementById("fonction").value= null;
      }
      else if(!this.uploadedImage.type.includes("application/pdf") && !this.uploadedImage.type.includes("image/")){
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Veuillez choisir un fichier image ou pdf.",
          showConfirmButton: false,
          timer: 6000
        })

        // @ts-ignore
        document.getElementById("file").value= null;
        // @ts-ignore
        document.getElementById("fonction").value= null;
      }
      else{
        this.isImageUpdated =true;
        const reader = new FileReader();
        reader.readAsDataURL(this.uploadedImage);
        reader.onload = () => {
          this.myImage = reader.result as string;
        };
      }

    }
  }
  

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.value) {
      this.currentDemandeur.datedenaissance = inputElement.value;
    }
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