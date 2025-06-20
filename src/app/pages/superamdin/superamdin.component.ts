import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConfiguration } from 'src/app/services/api-configuration';
import { TitreDto, UtilisateurDto } from 'src/app/services/models';
import { ProfileService, TitreService } from 'src/app/services/services';
import { UtilisateurService } from 'src/app/services/services/utilisateur.service';

@Component({
  selector: 'app-superamdin',
  templateUrl: './superamdin.component.html',
  styleUrls: ['./superamdin.component.css']
})
export class SuperamdinComponent implements OnInit {

  utilisateurDto: UtilisateurDto[] = [];
  urlSafe: any;
  valid: boolean = true;
  currentUtilisteur: UtilisateurDto={};
  // urlimage: string = "http://localhost:8080";
  urlimage: string = 'https://api.demarche.mfprsp.com';
  

  titre: TitreDto = {titre: ""};
  titreDTO: TitreDto [] = [];
  titres: TitreDto [] = [];



  constructor(private auth: UtilisateurService,
               private titreService: TitreService,
               private santizer: DomSanitizer, 
               private ac: ActivatedRoute, 
               private apiUrl: ApiConfiguration, 
               private profileService : ProfileService,
               private router: Router,
               onfig: ApiConfiguration) { }

  ngOnInit(): void {
    // const id = this.ac.snapshot.params['usseId'];
    this.auth.getById({id: localStorage.getItem("userId") as unknown as number}).subscribe({
      next:(data)=>{
        this.currentUtilisteur = data;
        this.urlSafe = this.santizer.bypassSecurityTrustResourceUrl(this.apiUrl.rootUrl+"/api/uploads/loadImageTraitant/"+this.currentUtilisteur.id);
        console.log(data);
      }
    })
    this.getUtilisateurByProfile();
    this.getUrl();
    this.getAllTitre();

  }

getUtilisateurByProfile() {
  this.auth.getByProfileCode({code: 'traitant'}).subscribe({
    next: (data: UtilisateurDto[]) => {
      this.utilisateurDto = data; 
    },
  
  });
}


deleteTraitant(id: number){
  // const id = this.ac.snapshot.params['id'];
  if (confirm('Souhaitez vous supprimer ce traitant?')) {
    this.auth.deleteTraitant({id: id}).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (err) => {
        console.error('Erreurr de suppression du traitant', err);
      },
    });
  }
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


saveTitre() {
  this.titreService.createTitre({body: this.titre}).subscribe({
    next: (id: number) => {
      this.router.navigate(['admin/dashboard']); 
      window.location.reload();
    },
    error: (err) => {
      console.error('Erreur lors de la création du titre:', err);
      alert('Erreur lors de la création du titre.');
    }
  });
  
}

getAllTitre() {
  this.titreService.getAllTitres().subscribe(data => {
    this.titres = data; 
    this.titreDTO = data;
  });
}


retour(){
  this.router.navigate(['admin/dashboard']); 
}

deleteTitre(titreId: number){
  alert('Souhaitez vous supprimer ce titre !');
  this.titreService.deleteTitre({id: titreId}).subscribe({
    next: () => {
      window.location.reload();
    }
  });
}

}
