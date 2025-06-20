import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IntercoDto } from 'src/app/auth/model/interco-dto';
import { ImageService } from 'src/app/auth/service/image.service';
import { DemandeurDto } from 'src/app/services/models';
import { DemandeurService, FileuploadService, UtilisateurService } from 'src/app/services/services';
import { IntercoService } from 'src/app/services/services/interco.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-interco',
  templateUrl: './interco.component.html',
  styleUrls: ['./interco.component.css']
})
export class IntercoComponent implements OnInit {


  siteKey: string = "6Lec8i0qAAAAANuNhPztaDG503ffz16BHQWcaCYY"; // localhost
  formDemande!: FormGroup;
  uploadedFile!: File | null;
  file!: File;
  id!: number;
  allData: any;
  idDemandeur: DemandeurDto = {adresse: '', lieudenaissance: '', sexe: '', telephone: ''};
  loading: boolean = false;

  intercoDTO: IntercoDto = {prenom:"", nom:"", email:"", nin:"", telephone:"", datedenaissance:"", lieudenaissance:"", adresse:"", sexe:"", fonction:"", password:"", scannernin:"", confirmemail:""};
  selectedFiles: File[] = [];


  constructor(private intercoService: IntercoService,
    private ac: ActivatedRoute, 
    private demandeurService: DemandeurService,
    private router: Router,
    private utilisateur: UtilisateurService,
    private fileService: FileuploadService,
    private imageService: ImageService) {
    
  }

  ngOnInit() {
    this.id = this.ac.snapshot.params['id'];
    this.formDemande = new FormGroup({
      nin: new FormControl('', Validators.required),
      prenom: new FormControl('', Validators.required),
      nom: new FormControl('', Validators.required),
      datedenaissance: new FormControl('', Validators.required),
      lieudenaissance: new FormControl('', Validators.required),
      sexe: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      confirmemail: new FormControl('', [Validators.required, Validators.email]),
      fonction: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.required),
      adresse: new FormControl('', Validators.required),
      // recaptcha: new FormControl('', Validators.required),
      scannernin: new FormControl(null),
      file: new FormControl(null, Validators.required) // Champ pour le fichier
    });
  }


  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const files = input.files;
  //     this.selectedFiles = Array.from(input.files);
  //     this.formDemande.patchValue({ file: files });
  //     this.formDemande.get('file')!.updateValueAndValidity();
  //   }
  // }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = input.files;
      this.selectedFiles = Array.from(files);
      this.formDemande.patchValue({ file: files });
      this.formDemande.get('file')!.updateValueAndValidity();
    }
  }
  
  annuler(){
     window.location.reload();
  }
  

  onSubmitform() {
    if (!this.formDemande.valid) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Veuillez remplir tous les champs requis.",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }
    
    console.log("Form Data: ", this.formDemande.value);  // Ajoutez ce log pour vérifier les données
    alert("start");
    this.intercoService.registerUtilisateur(this.formDemande.value).subscribe(
      response => {
        alert("response data " + response);
        console.log("Réponse backend : ", response); // Vérifiez la réponse
        alert("L'inscription a réussi !");
        this.allData = response;
      },
      error => {
        console.error("Erreur d'inscription : ", error);  // Ajoutez un log détaillé en cas d'erreur
        Swal.fire({
          icon: 'error',
          title: 'Échec de l’inscription',
          text: error.message || 'Une erreur est survenue.'
        });
      }
    );
  }


  onSubmit() {
    if (!this.formDemande.valid) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Veuillez remplir tous les champs requis.",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }
  
    console.log("Données de l'utilisateur :", this.formDemande.value);
  
    this.loading = true;
    this.intercoService.registerUtilisateur(this.formDemande.value).subscribe(
      response => {
        this.loading = false;
        this.idDemandeur = response.demandeurId;
        console.log("Réponse backend pour l'enregistrement utilisateur : ", response);
        // alert("L'inscription a réussi !");
  
        if (!this.selectedFiles || this.selectedFiles.length === 0) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Veuillez sélectionner au moins un fichier.",
            showConfirmButton: false,
            timer: 3000
          });
          return;
        }
  
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  
        this.selectedFiles.forEach((file: File) => {
          if (!allowedTypes.includes(file.type)) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: `Le fichier ${file.name} n'est pas autorisé.`,
              showConfirmButton: false,
              timer: 3000
            }).then(() => {
              window.location.reload();
            });;
            return;
          }
  
          if (file.type.includes("image")) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
  
            reader.onload = () => {
              const base64Image = reader.result as string;
              // this.loading = true;
              this.imageService.uploadImageInterco(
                file,
                base64Image,
                Number(this.idDemandeur),
                this.formDemande.value
              ).subscribe({
                next: (response) => {
                  // this.loading = false;
                  console.log("Image uploadée avec succès :", response);
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Demande Effectuée avec Succes !",
                    showConfirmButton: true,
                    timer: 6000,
                    confirmButtonText: 'OK'
                  }).then(() => {
                    window.location.reload();
                  });
                },
                error: (err) => {
                  console.error("Erreur lors de l'upload de l'image :", err);
                  Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Erreur lors de l'upload de ${file.name}.`,
                    text: err.message || 'Une erreur est survenue.',
                    showConfirmButton: true
                  });
                }
              });
            };
  
            reader.onerror = (err) => {
              console.error("Erreur de lecture de l'image :", err);
            };
          } else {
            // PDF
            // this.loading = true;
            this.imageService.uploadImageInterco(
              file,
              '',
              Number(this.idDemandeur),
              this.formDemande.value
            ).subscribe({
              next: (response) => {
                // this.loading = false;
                console.log("PDF uploadé avec succès :", response);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Demande Effectuée avec Succes!",
                  showConfirmButton: true,
                  timer: 6000,
                  confirmButtonText: 'OK'
                })
              },
              error: (err) => {
                console.error("Erreur lors de l'upload du PDF :", err);
                Swal.fire({
                  position: "center",
                  icon: "error",
                  title: `Erreur lors de l'upload de ${file.name}.`,
                  text: err.message || 'Une erreur est survenue.',
                  showConfirmButton: true
                });
              }
            });
          }
        });
      },
      error => {
        console.error("Erreur d'inscription : ", error);
        Swal.fire({
          icon: 'error',
          title: 'Échec de l’inscription',
          text: error.message || 'Une erreur est survenue.'
        });
      }
    );
  }
  


    

  
}
