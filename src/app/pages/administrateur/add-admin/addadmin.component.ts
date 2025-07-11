import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from 'src/app/auth/service/image.service';
import { ApiConfiguration } from 'src/app/services/api-configuration';
import { DemandeurDto, Utilisateur, UtilisateurDto } from 'src/app/services/models';
import { TitreDto } from 'src/app/services/models/titre-dto';
import { DemandeurService, UtilisateurService, FileuploadService, TitreService } from 'src/app/services/services';
import Swal from 'sweetalert2';
import { User } from 'src/app/auth/model/user';


@Component({
  selector: 'app-addadmin',
  templateUrl: './addadmin.component.html',
  styleUrls: ['./addadmin.component.css']
})
export class AddadminComponent implements OnInit {

  public user = new User();
  // public titre = new Titre();
  users: UtilisateurDto = {prenom: "", nom: "", email: "", nin: "", titre: ""};// = new DemandeurDto();
  titres: TitreDto [] = [];
  titress: TitreDto = {titre: ""};// = new DemandeurDto();


  confirmPassword? : string;
  myForm! : FormGroup
  myFormTitre!: FormGroup;
  err: any;
  loading: boolean = false;
  utilisateur?: Utilisateur[];
  uploadedImage!: File;
  isImageUpdated: Boolean=false;
  myImage!: string;

  urlSafe: any;
   valid: boolean = true;

   titreDTO: TitreDto [] = [];

  


  errMessage: any;

  constructor(private formBuilder : FormBuilder, private auth: UtilisateurService,
     private router: Router,private imageService: ImageService,
     private santizer: DomSanitizer, private ac: ActivatedRoute, 
     private apiUrl: ApiConfiguration, 
     private serviceTitre: TitreService) { }

  ngOnInit(): void {
    this.urlSafe = this.santizer.bypassSecurityTrustResourceUrl(  this.apiUrl.rootUrl +"/api/uploads/loadAttestation/"+this.ac.snapshot.params['id']);
    this.myForm = this.formBuilder.group(
      {
        prenom : ['', [Validators.required]],
        nom : ['', [Validators.required]],
        titre : ['', [Validators.required]],
        nin : ['', [Validators.required]],
        email : ['', [Validators.required]],
        password : ['', [Validators.required]],
        telephone : ['', [Validators.required]],

        // signature : ['', [Validators.required, Validators.email, this.noWhiteSpaceValidator]],
      },
    )

   this.getAllTitre();

   this.myFormTitre = this.formBuilder.group(
    {
      titre : ['', [Validators.required]],

      // signature : ['', [Validators.required, Validators.email, this.noWhiteSpaceValidator]],
    },
  )
  }
  getAllTitre() {
    this.serviceTitre.getAllTitres().subscribe(data => {
      this.titres = data; // Assuming data is now an array of TitreDTO
      this.titreDTO = data;
    });
  }

  getUrl() {
    var date = new Date(); 
    var expiredDate = new Date(date); 
    expiredDate.setMonth(expiredDate.getMonth() + 9); 
    if(this.ac.snapshot.params['id'] && date >= expiredDate){
        this.valid;
    }
      this.valid = false;
   
}

  onRegister() {
    this.loading = true;
    this.auth.registration({body: this.user}).subscribe({
      next:(data)=>{
        this.loading = false;
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Inscription réussie, veillez vous connecter avec vos identifiants pré-remplis",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['connexion']);
        });

      },
      error:(err:any)=>{
        if (err.error.errorMessage === 'EMAIL_EXIST') {
          Swal.fire({
            position: "center",
            icon: 'error',
            title: 'Inscription',
            text: 'Cet email existe deja',
          }).then(()=>{
            window.location.reload();
          })
        }
        if (err.error.errorMessage==='NIN_EXIST') {
          Swal.fire({
            position: "center",
            icon: 'error',
            title: 'Inscription',
            text: 'Ce numéro d"identification existe deja',
          }).then(()=>{
            window.location.reload();
          })
        }
        if (err.error.errorMessage==='EMAIL_NIN_EXIST') {
          Swal.fire({
            position: "center",
            icon: 'error',
            title: 'Inscription',
            text: 'Email et identifiant existe deja',
          }).then(() => {
            window.location.reload();                
          });
        }
        console.log(err.error.validationErrors)
        this.errMessage = err.error.validationErrors
      }
    })
  }
  noWhiteSpaceValidator(control: AbstractControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }
  matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const controlToMatch = control.get(controlName);
      const matchingControl = control.get(matchingControlName);

      if (!controlToMatch || !matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['matching']) {
        return null;
      }

      if (controlToMatch.value !== matchingControl.value) {
        matchingControl.setErrors({ matching: true });
        return { matching: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
  myFunction() {
    confirm("Press a button!");
  }

  annuler(){
    this.router.navigate(['admin/dashboard'])
  }
  onCreate() {
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
      // @ts-ignore 
      this.user.id = localStorage.getItem("id");
      this.loading = true;
      this.auth.registeTraitant({body: this.user}).subscribe({
        next:(data)=>{
          this.loading = false;
          console.log(this.user)
          this.imageService.uploadImageFST(this.uploadedImage,data).subscribe({
            next:(response)=>{
              Swal.fire({
                position: "center",
                icon: "success",
                title: "inscription traitant réussie !",
                showConfirmButton: false,
                timer: 1000
              }).then(() => {
                this.router.navigate(['admin/dashboard']);
                // window.location.reload();   

              });
            },
            error:(err:any)=>{
              console.log(err)
            }
          })
        },
        error:(err:any)=>{
          console.log(err)
        }
      })
    }

  }
  

  onImageUpload($event: Event) {
    // @ts-ignore
    if(event.target.files && event.target.files.length) {

      // @ts-ignore
      this.uploadedImage = event.target.files[0];
      console.log(this.uploadedImage)
      this.isImageUpdated =true;
      const reader = new FileReader();
      reader.readAsDataURL(this.uploadedImage);
      reader.onload = () => {
        this.myImage = reader.result as string;
        
      };
    }
  }


  saveTraitant(){
    console.log('user '+this.user);
    
    this.auth.registeTraitant({body:this.user}).subscribe(data=>{
      console.log(data);
      this.router.navigate(['/admin/dashboard'])
    },
      error => console.log(error)
      
    );
  }

  onSubmit(){
    console.log(this.user);
    this.saveTraitant();
    
  }


  saveTitre() {
    this.serviceTitre.createTitre({body:this.titress}).subscribe({
      next: (id: number) => {
        console.log('Titre créé avec ID:', id);
        alert(`Titre créé avec ID: ${id}`);
      },
      error: (err) => {
        console.error('Erreur lors de la création du titre:', err);
        alert('Erreur lors de la création du titre.');
      }
    });
  }
  

 
}


