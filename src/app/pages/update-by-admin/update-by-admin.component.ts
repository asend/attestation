import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from 'src/app/auth/service/image.service';
import { ApiConfiguration } from 'src/app/services/api-configuration';
import { AttestationService, DemandeService, DemandeurService, FileuploadService, MailService, SendMailService } from 'src/app/services/services';
import {DemandeurDto} from "../../services/models/demandeur-dto";
import Swal from 'sweetalert2';
import { DemandeDto } from 'src/app/services/models/demande-dto';

@Component({
  selector: 'app-update-by-admin',
  templateUrl: './update-by-admin.component.html',
  styleUrls: ['./update-by-admin.component.css']
})
export class UpdateByAdminComponent implements OnInit {

  currentDemande: DemandeDto={ };
  urlSafe: any;

  // urlimage: string = "http://localhost:8080";
  urlimage: string = 'https://api.demarche.mfprsp.com';


  loading: boolean = false;
  loadingReject: boolean = false;

  currentDemandeur: DemandeurDto = {adresse: "", lieudenaissance: "", sexe: "", telephone: "", datedenaissance: ""}

  myImage!: string;
  uploadedImage!: File;
  isImageUpdated: Boolean=false;

  constructor(
    private ac: ActivatedRoute,private demandeService: DemandeService,private router: Router, private mailService: SendMailService,private demandeurService: DemandeurService,
    private attestationService: AttestationService,public santizer: DomSanitizer,private fileUpladService: FileuploadService,private imageService: ImageService,
    private apiUrl: ApiConfiguration,private mailServices: MailService) { }
  
  
ngOnInit(): void {
    this.demandeService.getById2({id: this.ac.snapshot.params['id']}).subscribe({
      next:(data)=>{
        this.currentDemande = data
        this.urlSafe = this.santizer.bypassSecurityTrustResourceUrl(this.apiUrl.rootUrl+"/api/uploads/loadfromFS/"+this.currentDemande.demandeurDTO?.id);
      }
    })
    this.demandeurService.getById1({id: this.ac.snapshot.params['id']}).subscribe({
      next:(data)=>{
        this.currentDemandeur = data;
        this.urlSafe = this.santizer.bypassSecurityTrustResourceUrl(this.apiUrl.rootUrl+"/api/uploads/loadfromFS/"+this.currentDemande.demandeurDTO?.id);

      }
    })

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

  this.demandeurService.updateDemandeur({ body: this.currentDemandeur }).subscribe({
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
        });
      }
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
      this.router.navigate(['verification', this.currentDemande.id])
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
  
}