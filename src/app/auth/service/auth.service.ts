import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../model/user";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Observable} from "rxjs";
import {AuthenticationRequest, AuthenticationResponse} from 'src/app/services/models';
import {ApiConfiguration} from "../../services/api-configuration";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private helper = new JwtHelperService();

  public loggedUser!:string;
  public isloggedIn: Boolean = false;
  public roles!:string[];
  public profil!: string;
  token!: string;
  public regitredUser : User = new User();
  public loginUser : User = new User();
  public userId!: number;
  public fullName!: string;

  constructor(private router: Router, private http: HttpClient, private apiConf: ApiConfiguration) { }


  login(user : AuthenticationRequest): Observable<AuthenticationResponse>
  {
    return this.http.post<AuthenticationResponse>(this.apiConf.rootUrl+'/api/utilisateur/authentication', user );
  }
  saveToken(jwt:string){
    localStorage.setItem('token',jwt);
    this.token = jwt;
    this.isloggedIn = true;
    this.decodeJWT();
  }

  decodeJWT() {
    if (this.token == undefined)
      return;
    const decodedToken = this.helper.decodeToken(this.token);
    this.profil = decodedToken.profile;
    this.loggedUser = decodedToken.sub;
    this.fullName = decodedToken.fullName
    localStorage.setItem('profile',this.profil);
    localStorage.setItem('nin',decodedToken.nin);
    localStorage.setItem('email',decodedToken.email);
    localStorage.setItem('userId',decodedToken.userId);
    localStorage.setItem('fullName',decodedToken.fullName);
  }

  setRegistredUser(user : User){
    this.regitredUser=user;
  }
  getRegistredUser(){
    return this.regitredUser;
  }

  /*SignIn(user :User):Boolean{
    let validUser: Boolean = false;
    this.users.forEach((curUser) => {
      if(user.username== curUser.username && user.password==curUser.password) {
        validUser = true;
        this.loggedUser = curUser.username;
        this.isloggedIn = true;
        this.roles = curUser.roles;
        localStorage.setItem('loggedUser',this.loggedUser);
        localStorage.setItem('isloggedIn',String(this.isloggedIn));
      } });
    return validUser;
  }*/

  isAdmin():boolean{
    if (!this.profil) //this.roles== undefiened
      return false;
    return  this.profil == 'admin' ? true : false
  }
  isTraitant():boolean{
    if (!this.profil) //this.roles== undefiened
      return false;
    return  this.profil == 'traitant' ? true : false
  }
  

  logout() {
    this.isloggedIn= false;
    this.loggedUser = undefined!;
    this.profil = undefined!;
    localStorage.clear()
    this.router.navigate(['connexion']);

  }

  loadToken() {
    this.token = localStorage.getItem('token')!;
    this.decodeJWT();
  }

  isTokenExpired(): Boolean
  {
    return  this.helper.isTokenExpired(this.token);
  }

  setLoggedUserFromLocalStorage(login : string) {
    this.loggedUser = login;
    this.isloggedIn = true;
  }

  getToken(): string {
    return this.token;
  }
  //   getToken(): string | null {
  //   return localStorage.getItem('token');
  // }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null && !this.isTokenExpired(); // Ensure token exists and is not expired
  }


}
