import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TitreDto } from 'src/app/services/models/titre-dto';
import { TitreService, UtilisateurService } from 'src/app/services/services';

@Component({
  selector: 'app-add-titre',
  templateUrl: './add-titre.component.html',
  styleUrls: ['./add-titre.component.css']
})
export class AddTitreComponent implements OnInit {
  titre: TitreDto = {titre: ""};
  titreDTO: TitreDto [] = [];
  titres: TitreDto [] = [];


  constructor(private auth: UtilisateurService,private router: Router, private titreService: TitreService) { }

  ngOnInit(): void {
    this.getAllTitre();
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
