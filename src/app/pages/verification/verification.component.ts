import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SendMailService} from "../../services/services/send-mail.service";
import {AttestationService} from "../../services/services/attestation.service";
import {DemandeService} from "../../services/services/demande.service";
import {DemandeDto} from "../../services/models/demande-dto";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {FileuploadService} from "../../services/services/fileupload.service";
import Swal from "sweetalert2";
import {ApiConfiguration} from "../../services/api-configuration";
import {MailService} from "../../services/services/mail.service";
import { DemandeurService, UtilisateurService } from 'src/app/services/services';
import { DemandeurDto } from 'src/app/services/models/demandeur-dto';
import { UtilisateurDto } from 'src/app/services/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  isModalOpen: boolean = false;
  isModalMatriculeOpen: boolean = false;


  currentUtilisateur: UtilisateurDto = {}


  verifierClicked = false; // Flag to track if "Vérifier" was clicked


  currentDemande: DemandeDto={};
  currentDemandes: DemandeDto={motifrejet: ""};
  currentDemandeurs: DemandeurDto={
    matriculeSolde: "",
    adresse: '',
    lieudenaissance: '',
    sexe: '',
    telephone: '',
  };


  // currentDemandeur: DemandeurDto = {adresse: "", lieudenaissance: "", sexe: "", telephone: ""}
  currentDemandeur: DemandeurDto = {
    adresse: "", lieudenaissance: "", sexe: "", telephone: "",
    datedenaissance: ''
  }

  urlSafe: any;
  images: any[] = [];
  urlSafeList: SafeResourceUrl[] = [];
  isIframeVisible: { [key: number]: boolean } = {};
  

  

  loading: boolean = false;
  onRejet: boolean = false;
  loadingReject: boolean = false;
  loadingRejecte: boolean = false;
  loadingMotifReject: boolean = false;
  loadingMatriculeSolde: boolean = false;

  uploadedImages!: File[];

  


  // isIframeVisible: number | null = null;

  // urlimage: string = "http://localhost:8080";
  // urlimage: string = 'https://api.demarche.mfprsp.com';
  urlimage: string = environment.apiUrl;

  id: any;
  demandeId: number | undefined;

  constructor(
    private ac: ActivatedRoute,
    private demandeService: DemandeService,
    private router: Router,
    private mailService: SendMailService,
    private attestationService: AttestationService,
    // private santizer: DomSanitizer,
    public santizer: DomSanitizer,
   private fileUpladService: FileuploadService,
    private apiUrl: ApiConfiguration,
    private mailServices: MailService,
    private fileUploadService: FileuploadService,
    private demandeurService: DemandeurService,
    private utilisateurService: UtilisateurService
    // private santizer: DomSanitizer
  ) { }
  ngOnInit(): void {
    this.demandeService.getById2({id: this.ac.snapshot.params['id']}).subscribe({
      next:(data)=>{
        this.currentDemande = data;
        this.demandeId = data.id; 
        // alert("this.currentDemande.demandeurDTO?.utilisateurDTO?.id! " + this.currentDemande.demandeurDTO?.id );
        
        console.log("currentDemande " + data.demandeurDTO?.id);
        
      }
    })
  }

  formatDateToDDMMYYYY(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  


  openModal() {
    this.isModalOpen = true;
    console.log('Demande ID:', this.demandeId); // Log the ID to verify
  }
  openModalMatricule() {
    this.isModalMatriculeOpen = true;
  }

  
  closeModal() {
    this.isModalOpen = false; // Ferme la modale
  }
  closeModalMatricule() {
    this.isModalMatriculeOpen = false;
  }


  onVerifierClicked() {
    this.verifierClicked = true;
  }

  clickRejet() {
    Swal.fire({
      title: 'Souhaitez-vous rejeter cette demande ?',
      showDenyButton: true,  // Show Deny button (Non)
      showCancelButton: false,  // Hide Cancel button
      confirmButtonText: 'oui',  // Confirm button (Oui)
      denyButtonText: 'non',  // Deny button (Non)
      customClass: {
        actions: 'my-actions',
        confirmButton: 'order-2',  // Custom class for confirm button
        denyButton: 'order-3',  // Custom class for deny button
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.rejectInternet(this.currentDemande);  // Action for "oui"
      } else {
        window.location.reload();  // Reload page for "non"
        this.router.navigate(['/verification', this.id]);
      }
    });
  }
  
  
  //clickRejet() {
    // const message = "Souhaitez-vous rejeter cette demande? "; 
    // if (confirm(message)) {
    //   this.onRejected();
    // } else {
    //   window.location.reload();
    //   this.router.navigate(['/verification',this.id]);
    // }
  //}

  clickApprouve() {
    Swal.fire({
      title: 'Souhaitez-vous approuver cette demande ?',
      showDenyButton: true,
      showCancelButton: false,  // Disable the Cancel button
      confirmButtonText: 'oui',
      denyButtonText: 'non',
      customClass: {
        actions: 'my-actions',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.onApproved();
      } else {
        this.router.navigate(['/verification', this.id]);
      }
    });
  }
  
  

  onApproved() {
    this.loading = true;
    this.attestationService.generate({idUser:Number(localStorage.getItem("userId")),idDemandeur:Number(this.currentDemande.demandeurDTO?.id),idDemande:Number(this.currentDemande.id),idStructure:1}).subscribe({
      next:(data)=>{
        this.loading = false;
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Vous avez appouvé la demande.",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['traitant/dashboard']);
        })
      },
      error:(err:any)=>{
        console.log(err)
     }
    })
  }

  
  onBack() {
    this.router.navigate(['traitant/dashboard'])
  }
  onRejected() {
    this.mailService.rejeted({id: this.ac.snapshot.params['id']}).subscribe({
      next:(data)=>{
        this.router.navigate(['traitant/dashboard'])
      },
      error:(err:any)=>{
        console.log(err);
      }
    })
  }

  rejectInternet(currentDemande: DemandeDto) {
    // this.loadingReject = true;
    this.mailServices.sendMailRejectInterne({id: Number(currentDemande.id)}).subscribe({
      next:(data)=>{
        // this.loadingReject = false;
      // Swal.fire({
      //     position: "center",
      //     icon: "error",
      //     title: "Demande rejetée car le demandeur est un agent de l'Etat",
      //     showConfirmButton: false,
      //     timer: 1000
      //   }).then(() => {
          // this.router.navigate(['admin/dashboard']);
          this.router.navigate(['traitant/dashboard']);
        // })
      },
      error:(err:any)=>{
        console.log(err);
      }
    })
  }

  rejectExtern(currentDemande: DemandeDto) {
    this.loadingRejecte = true;
    this.mailServices.sendMailRejectexterne({id: Number(currentDemande.id)}).subscribe({
      // this.mailServices.sendMailRejectexterne({id: this.ac.snapshot.params['id']}).subscribe({
      next:(data)=>{
        this.loadingRejecte = false;
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Demande rejetée pour non conformité des données",
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          this.router.navigate(['traitant/dashboard']);
        })
      },
      error:(err:any)=>{
        console.log(err);
      }
    })
  }
  
  toggleIframe(imageId: number): void {
    this.isIframeVisible[imageId] = !this.isIframeVisible[imageId];
  }





  onUpdate() {
    this.loading = true;
      this.demandeurService.updateDemandeur({body: this.currentDemandeur}).subscribe({
        next:(data)=>{
          this.loading = false;
          this.router.navigate(['verification/', this.currentDemande.id])
        },
        error:(err:any)=>{
          this.router.navigate(['verification/', this.currentDemande.id])
        }
      })
  }


  // updateMotifRejet() {
  //   this.loadingMotifReject = true;
  //   this.demandeService.updateMotifRejet(this.currentDemande.id as number, this.currentDemande.motifrejet as string).subscribe({
  //     next: (response) => {
  //       this.loadingMotifReject = false;
  //       console.log('Mise à jour réussie, ID:', response);
  //       this.router.navigate(['verification/', this.currentDemande.id]);
  //     },
  //     error: (error) => {
  //       this.loadingMotifReject = false;
  //       console.error('Erreur lors de la mise à jour', error);
  //     }
  //   });
  // }


  // onMotifRejet() {
  //   this.loadingMotifReject = true;
  //   this.demandeService.updateMotifRejet(this.currentDemande.id as number, this.currentDemande.motifrejet as string).subscribe({
  //     next: (response) => {
  //       this.loadingMotifReject = false;
  //       console.log('Mise à jour réussie, ID:', response);
  //       Swal.fire({
  //         title: 'Souhaitez-vous rejeter cette demande ?',
  //         showDenyButton: true, 
  //         showCancelButton: false,
  //         confirmButtonText: 'oui', 
  //         denyButtonText: 'non', 
  //         customClass: {
  //           actions: 'my-actions',
  //           confirmButton: 'order-2', 
  //           denyButton: 'order-3',  
  //         },
  //       }).then(() => {
  //         this.rejectInternet(this.currentDemande);  
  //         this.router.navigate(['/traitant/dashboard']);
  //       });
  //     },
  //     error: (error) => {
  //       this.loadingMotifReject = false;
  //       console.error('Erreur lors de la mise à jour', error);
        
        
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'error',
  //         title: 'Motif rejet non envoyé.',
  //         showConfirmButton: true, 
          
  //       }).then(()=>{
  //         this.closeModal();
  //         this.router.navigate(['/traitant/dashboard']);
  //       });
  //     }
  //   });
  // }

  onMotifRejet() {
    Swal.fire({
      title: 'Souhaitez-vous rejeter cette demande ?',
      showDenyButton: true,  
      showCancelButton: false,  
      confirmButtonText: 'Oui',  
      denyButtonText: 'Non',  
      customClass: {
        actions: 'my-actions',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingMotifReject = true;
        this.demandeService.updateMotifRejet(this.currentDemande.id as number, this.currentDemande.motifrejet as string).subscribe({
          next: (response) => {
            this.loadingMotifReject = false;
            console.log('Mise à jour réussie, ID:', response);
  
            // Rejet effectué, on affiche une alerte
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Vous avez rejeté la demande.",
              showConfirmButton: false,
              timer: 2000 // Affiche l'alerte pendant 2 secondes
            }).then(() => {
              this.rejectInternet(this.currentDemande);
              this.closeModal();
              this.router.navigate(['/traitant/dashboard']);
            });
          },
          error: (error) => {
            this.loadingMotifReject = false;
            console.error('Erreur lors de la mise à jour', error);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Motif rejet non envoyé.',
              showConfirmButton: true,
            }).then(() => {
              this.closeModal();
              this.router.navigate(['/traitant/dashboard']);
            });
          }
        });
      } else if (result.isDenied) {
        Swal.fire('Action annulée', '', 'info');
      }
    });
  }
  



  onUpdateMatriculeSolde() {
    this.loadingMatriculeSolde = true;
  
    const matriculeSolde = this.currentDemandeur.matriculeSolde?.trim() || '';
  
    if (!matriculeSolde) {
      alert("Veuillez remplir le matricule de solde.");
      this.loadingMatriculeSolde = false;
      return;
    }
  
    this.demandeurService.updateMatriculeSolde(
      this.currentDemande.demandeurDTO?.id!,
      matriculeSolde
    ).subscribe({
      next: (response) => {
        this.loadingMatriculeSolde = false;
        console.log('Mise à jour réussie, ID:', response);
        // alert("Matricule mis à jour avec succès");
      },
      error: (error) => {
        this.loadingMatriculeSolde = false;
        console.error("Erreur de mise à jour :", error);
        // alert("Échec de mise à jour du matricule.");
      }
    });
  }
  
  onRejectDemande() {
   this.onRejet = true;
    this.attestationService.generatePdfRejet(
      Number(localStorage.getItem("userId")),
      Number(this.currentDemande.demandeurDTO?.id),
      Number(this.currentDemande.id),
      1).subscribe({
      next:(data)=>{
        this.onRejet = false;
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Vous avez rejeté la demande.",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['traitant/dashboard']);
        })
      },
      error:(err:any)=>{
        console.log(err)
     }
    })
  }

  clickToRejetPdf() {
    Swal.fire({
      title: 'Souhaitez-vous Rejeter cette demande ?',
      showDenyButton: true,
      showCancelButton: false,  // Disable the Cancel button
      confirmButtonText: 'oui',
      denyButtonText: 'non',
      customClass: {
        actions: 'my-actions',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.onRejectDemande();
      } else {
        this.router.navigate(['/verification', this.id]);
      }
    });
  }
  
  


  RejectDefinitif() {
    const matricule = this.currentDemandeur.matriculeSolde?.trim();
  
    if (!matricule) {
      alert("Ajoutez le matricule de solde");
      return;
    }
  
    this.loadingMatriculeSolde = true;
  
    // Étape 1 : Mise à jour du matricule
    this.demandeurService.updateMatriculeSolde(
      this.currentDemande.demandeurDTO?.id!,
      matricule
    ).subscribe({
      next: (response) => {
        this.loadingMatriculeSolde = false;
        // alert("Matricule mis à jour avec succès");
  
        // Facultatif : actualiser manuellement le champ local
        this.currentDemandeur.matriculeSolde = matricule;
  
        // Étape 2 : Génération du PDF avec le nouveau matricule
        this.onRejectDemande();
      },
      error: (error) => {
        this.loadingMatriculeSolde = false;
        console.error("Erreur de mise à jour :", error);
        alert("Échec de mise à jour du matricule.");
      }
    });
  }
  
  



}

  
  


  

