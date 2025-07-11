import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { UtilisateurService } from 'src/app/services/services';
import { AuthenticationRequest } from 'src/app/services/models';
import { AuthService } from 'src/app/auth/service/auth.service';
import Swal from 'sweetalert2';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  visible!: boolean;

  showPassword: boolean = false;



  user: AuthenticationRequest = {};
  err!:number;
  name!: string;
  private message: any;
  constructor(private auth: UtilisateurService, private authService: AuthService, private router: Router, private active : ActivatedRoute) { }

  ngOnInit(): void {
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(['admin']);
    // }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  isLoggedIn(): boolean{
    return !!localStorage.getItem('token');
  }

  // connected(){
  //   if(localStorage.getItem('token') != null){
  //     Swal.fire({
  //       position: "center",
  //       icon: "error",
  //       title: "Vous êtes déja connecté, merci de vous deconnectez d'abord.",
  //       showConfirmButton: false,
  //       timer: 2000 // Affiche l'alerte pendant 2 secondes
  //     })
  //   }

  // }

  
  onLoggedin() {
    this.loading = true;
    console.log(this.user);
    // alert("before login"
    this.auth.authentication({body:this.user}).subscribe({
      next:(data)=>{
        // alert("in login")
      this.loading = false;
      // this.connected();
        localStorage.setItem('token', data.token as string);
        this.authService.saveToken(data.token as string)
        this.isLoggedIn()
          const helper = new JwtHelperService();
          const decodedToken = helper.decodeToken(data.token as string);
          if (decodedToken.profile ==='user'){
            this.router.navigate(['demandeur']);
          }else if(decodedToken.profile ==='traitant'){
            this.router.navigate(['traitant/dashboard']);
          }else if(decodedToken.profile ==='admin'){
            this.router.navigate(['admin/dashboard']);
          }else if(decodedToken.profile ==='consultant'){
            this.router.navigate(['statistiques']);

          }
          else{
            this.router.navigate(['access-denied']);
          }
      },
      error:(err:any)=>{
        console.log(err)
        Swal.fire({
                position: "center",
                icon: "error",
                title: "Email ou mot de passe incorrect.",
                showConfirmButton: false,
                timer: 1000
              }).then(() => {
               this.router.navigate(['connexion']);
                window.location.reload();   
                console.log(err)           
              });
      }
    })
  }

  clickMethod() {
    const message = "Are you sure you want to register?"; 
    if (confirm(message)) {
      this.onLoggedin();
    } else {
      this.router.navigate(['connexion']);
    }
  }
  
}
