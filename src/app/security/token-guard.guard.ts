import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {JwtHelperService} from "@auth0/angular-jwt";
import { Profile } from '../services/models';

@Injectable({
  providedIn: 'root'
})
export class TokenGuardGuard implements CanActivate {

  profile: Profile = {};
  constructor(private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem("token");
    if(!token){
      this.router.navigate(['connexion']);
      return false;
    }
   
   
    const jwtHelper = new JwtHelperService();
    const isTokenExpired = jwtHelper.isTokenExpired(token);
    if (isTokenExpired) {
      localStorage.clear();
      this.router.navigate(['connexion']);
      return false;
    }
    return true;
  }

  

}
