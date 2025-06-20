import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {ApiConfiguration} from "../../services/api-configuration";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../environments/environment";
import { Demande } from 'src/app/services/models';

@Component({
  selector: 'app-visualiser',
  templateUrl: './visualiser.component.html',
  styleUrls: ['./visualiser.component.css']
})
export class VisualiserComponent implements OnInit {

   urlSafe: any;
   valid: boolean = true;

  constructor(private santizer: DomSanitizer, private ac: ActivatedRoute, private apiUrl: ApiConfiguration) { }

  ngOnInit(): void {
    this.urlSafe = this.santizer.bypassSecurityTrustResourceUrl(  this.apiUrl.rootUrl +"/api/uploads/loadAttestation/"+this.ac.snapshot.params['id']);


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
  

}
