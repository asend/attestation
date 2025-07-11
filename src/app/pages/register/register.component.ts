import { Component, OnInit } from '@angular/core';
import {User} from "../../auth/model/user";
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import { UtilisateurService } from 'src/app/services/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
[x: string]: any;
  public user = new User();
  confirmPassword? : string;
  myForm! : FormGroup
  err: any;
  loading: boolean = false;

  // showPassword: boolean = false;
  showPassword: boolean = false;
showConfirmPassword: boolean = false;




  errMessage: any;
  //  siteKey: string = "6LebTfcqAAAAAOiPWmhJlgY7AobxInjIwjRJRZPE"; //invisible
  // siteKey: string = "6Lec8i0qAAAAANuNhPztaDG503ffz16BHQWcaCYY"; //localhost
  siteKey: string = "6LfnCrMqAAAAAKKxyPShRaSmee-vReyGi4vV_qcI"; //api

  constructor(private formBuilder: FormBuilder, private auth: UtilisateurService, private router: Router) { }
  

  ngOnInit(): void {
    this.myForm = this.formBuilder.group(
      {
        prenom : ['', [Validators.required, this.noWhiteSpaceValidator]],
        nom : ['', [Validators.required, this.noWhiteSpaceValidator]],
        nin : ['', [Validators.required, this.noWhiteSpaceValidator]],
        email : ['', [Validators.required, Validators.email, , this.noWhiteSpaceValidator]],
        confirmemail : ['', [Validators.required, Validators.email, this.noWhiteSpaceValidator]],
        password : ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword : ['', [Validators.required]],
         recaptcha : ['',[Validators.required]]
      },
      {
        validators: [this.matchValidator('password', 'confirmPassword'), this.matchValidator('email','confirmemail')]
      }
    )
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

 

  onRegister() {
    this.loading = true;
    this.auth.registration({body: this.user}).subscribe({
      next:(data)=>{
        this.loading = false;
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Inscription réussie<br> Veillez vous connecter avec vos identifiants.",
          showConfirmButton: false,
          timer: 3000
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
            text: 'Vous avez déjá un compte avec cet email',
          }).then(()=>{
            window.location.reload();
          })
        }
        if (err.error.errorMessage==='NIN_EXIST') {
          Swal.fire({
            position: "center",
            icon: 'error',
            title: 'Inscription',
            text: 'Vous avez déjá un compte avec ce numero  identité.'
          }).then(()=>{
            window.location.reload();
          })
        }
        if (err.error.errorMessage==='EMAIL_NIN_EXIST') {
          Swal.fire({
            position: "center",
            icon: 'error',
            title: 'Inscription',
            text: 'Vous avez deja un compte, merci de vous connectez avec vos identifiants.',
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
  onFieldClick(fieldName: string): void {
    this.myForm.controls[fieldName].markAsTouched();
  }
 

}
