import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {
  constructor(private router: Router) {
  }
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     const jwtHelper = new JwtHelperService();
  //     const decodedToken = jwtHelper.decodeToken(token);
  //     if (decodedToken.profile !== 'admin') {
  //       this.router.navigate(['access-denied']);
  //       return false;
  //     }
  //     return true;
  //   }
  //   return false;
  // }
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     const jwtHelper = new JwtHelperService();
  //     const decodedToken = jwtHelper.decodeToken(token);
  //     if (decodedToken.profile !== 'admin') {
  //       this.router.navigate(['access-denied']);
  //       return false;
  //     }
  //     return true;
  //   }
  //   return false;
  // }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem("token");
  
    if (token) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
  
      // Check if the profile is either 'traitant' or 'admin'
      if (decodedToken.profile === 'traitant' || decodedToken.profile === 'admin' || decodedToken.profile === 'consultant') {
        return true;
      } else {
        this.router.navigate(['access-denied']);
        return false;
      }
    }
  
    // If no token is found, redirect to login
    this.router.navigate(['connexion']);
    return false;
  }
  

}
