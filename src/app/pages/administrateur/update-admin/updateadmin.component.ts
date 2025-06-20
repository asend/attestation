import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from 'src/app/auth/service/image.service';
import { ApiConfiguration } from 'src/app/services/api-configuration';
import { DemandeDto, DemandeurDto, Utilisateur, UtilisateurDto } from 'src/app/services/models';
import { DemandeService, SendMailService, DemandeurService, AttestationService, FileuploadService, MailService, UtilisateurService } from 'src/app/services/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-updateadmin',
  templateUrl: './updateadmin.component.html',
  styleUrls: ['./updateadmin.component.css']
})
export class UpdateadminComponent implements OnInit {

  // currentUtilisateur: UtilisateurDto={};
  urlSafe: any;
  utitlisateurDto?: UtilisateurDto ={};
  id!: number;

  loading: boolean = false;
  loadingReject: boolean = false;

  currentUtilisateurs: Utilisateur = {email: "", prenom: "", nom: "", titre: "", nin: "", signature: "", password: ""}
  currentUtilisateur: UtilisateurDto = {email: "", prenom: "", nom: "", titre: "", nin: "", telephone: ""}


  myImage!: string;
  uploadedImage!: File;
  isImageUpdated: Boolean=false;

  constructor(
    private ac: ActivatedRoute,private demandeService: DemandeService,private router: Router, private mailService: SendMailService,private demandeurService: DemandeurService,
    private attestationService: AttestationService,private santizer: DomSanitizer,private fileUpladService: FileuploadService,private imageService: ImageService,
    private apiUrl: ApiConfiguration,private mailServices: MailService, private auth: UtilisateurService) { }
  
  
ngOnInit(): void {
  this.id = this.ac.snapshot.params['id'];
    this.auth.getById({id: this.ac.snapshot.params['id']}).subscribe({
      next:(data)=>{
        this.currentUtilisateur = data
         this.urlSafe = this.santizer.bypassSecurityTrustResourceUrl(this.apiUrl.rootUrl+"/api/uploads/loadfromFS/"+this.currentUtilisateur.id);
      }
    })
  
  }

  onUpdate() {
    this.loading = true;
    console.log("image "+this.uploadedImage)
      //console.log(this.currentDemandeur)
      this.auth.updateTraitant( {id:this.id,body:this.currentUtilisateur}).subscribe({
        next:(data)=>{
          this.loading = false;
          if (this.uploadedImage!=undefined){
            console.log("size "+this.uploadedImage.size)
            this.imageService.uploadImageFST(this.uploadedImage,Number(this.currentUtilisateur.id)).subscribe({
              next:(response)=>{
                this.router.navigate(['admin/dashboard'])
                window.location.reload();   

              },
              error:(err:any)=>{
                this.router.navigate(['admin/dashboard'])
              }
            })
          }
          this.router.navigate(['admin/dashboard'])
        },
        error:(err:any)=>{
          this.router.navigate(['admin/dashboard'])
        }
      })
  }

  
  annuler(){
    this.router.navigate(['admin/dashboard'])
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


  // onSubmit(){
  //   console.log("this.currentUtilisateurs" +this.currentUtilisateur.fullName);
  //   this.currentUtilisateurs.email = this.currentUtilisateur.email
  //   this.currentUtilisateurs.prenom = this.currentUtilisateur.prenom
  //   this.currentUtilisateurs.nin = this.currentUtilisateur.nin
  //   this.currentUtilisateurs.titre = this.currentUtilisateur.titre
  //   this.currentUtilisateurs.nom = this.currentUtilisateur.nom
  //   this.currentUtilisateurs.password = this.currentUtilisateur.password
  //   this.auth.updateTraitant(this.id , this.currentUtilisateur).subscribe(data =>{
  //     this.router.navigate(['admin/dashboard'])
  //   }) 
  // }


  
}
