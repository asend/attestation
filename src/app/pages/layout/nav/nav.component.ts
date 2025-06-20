import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import {DemandeurDto} from "../../../services/models/demandeur-dto";
import {AuthService} from "../../../auth/service/auth.service";
import {DemandeurService} from "../../../services/services/demandeur.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  loIn = false;
  isAdmin = false;

  fullName!: string;
  demandeur!: DemandeurDto;

  token!: string;
showPassword: any;
  constructor(private router: Router, private demandeurService: DemandeurService) {
  }

  ngOnInit(): void {
    const jwts = localStorage.getItem("token");
    if (localStorage.getItem("token")){
      this.loIn = true
    }
    if (localStorage.getItem("profile")=="admin" || localStorage.getItem("profile")=="traitant"){
      this.isAdmin = true
    }
    if (localStorage.getItem("fullName")){
      // @ts-ignore
      this.fullName = localStorage.getItem("fullName")
    }
  }

  onlogout() {
    localStorage.clear();
    this.router.navigate(['connexion']);
    window.location.reload();
  }

  listDemande() {
    this.demandeurService.getByNin1({nin: localStorage.getItem("nin") as string}).subscribe({
      next:(data)=>{
        this.router.navigate(['/mes-demandes', data.id])
      }
    })
  }

}
