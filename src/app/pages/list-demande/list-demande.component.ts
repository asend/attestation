import { Component, OnInit } from '@angular/core';
import {DemandeService} from "../../services/services/demande.service";
import {DemandeDto} from "../../services/models/demande-dto";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {FileuploadService} from "../../services/services/fileupload.service";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import {saveAs} from "file-saver";
import Swal from "sweetalert2";
import { Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/websocket.service';

//import saveAs from 'file-saver';

@Component({
  selector: 'app-list-demande',
  templateUrl: './list-demande.component.html',
  styleUrls: ['./list-demande.component.css']
})
export class ListDemandeComponent implements OnInit {

  

  message = '';
  messages: string[] = [];
  private messageSub!: Subscription;

  demandes: DemandeDto[]=[];
  fileStatus = { status: '', requestType: '', percent: 0 };
  filenames: string[] = [];
  id!: number;
  loading: boolean = false;

  dec!: DemandeDto[];
  dr!: DemandeDto[];
  da!: DemandeDto[];

  visible!: boolean;
  url!: string;
  constructor(private demandeService: DemandeService, private ac: ActivatedRoute, private router: Router, private socketService: WebsocketService ) { }

  ngOnInit(): void {
    this.id = this.ac.snapshot.params['id'];
    this.getDemandes(this.id);
    this.getDemandeTab(this.id);
    console.log(this.getDemandeTab(this.id));
    
    this.eligible();

    this.messageSub = this.socketService.onMessage().subscribe((msg) => {
      console.log(msg);
      
      this.messages.push(msg);
    });

  }

  send() {
    this.message = "demande envoye"
    if (this.message.trim()) {
      this.socketService.sendMessage(this.message);
            console.log();
      this.message = '';
    }
  }

  
  getDemandes(id:number){
    this.demandeService.findByDemandeurId({"id": id}).subscribe({
      next:(data)=>{
        this.demandes = data;
      }
    })
  }
  getDemandeTab(id:number){
    this.demandeService.getbyTab({"id": id}).subscribe({
      next:(data)=>{
        this.dec = data["DEC"];
        this.da = data["DA"];
        this.dr = data["DR"];
        //console.log(this.da)
      }
    })
  }
  upload(id: number | undefined) {
    this.router.navigate(['visualiser', id]);
  }
  private resportProgress(httpEvent: HttpEvent<string[] | Blob>): void {
    switch(httpEvent.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Uploading... ');
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Downloading... ');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Array) {
          this.fileStatus.status = 'done';
          for (const filename of httpEvent.body) {
            this.filenames.unshift(filename);
          }
        } else {
          saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
            {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}));
        }
        this.fileStatus.status = 'done';
        break;
      default:
        console.log(httpEvent);
        break;

    }
  }
  private updateStatus(loaded: number, total: number, requestType: string): void {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded / total);
  }
   onMakeDemande(event: any) {
    this.loading = true;
    this.demandeService.demander({"id": this.ac.snapshot.params['id']}).subscribe({
      next:(data)=>{
        this.loading = false;
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Votre demande est prise en charge...",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.send();
          // window.location.reload();                
        });
        this.getDemandes(this.id);
        this.getDemandeTab(this.ac.snapshot.params['id']);
        this.visible = true;

      }
    })
  }
  eligible(){
    this.demandeService.eligible({id: this.ac.snapshot.params['id']}).subscribe({
      next:(data)=>{
        this.visible = data;
      }
    })
  }
  onDelete(id: number| undefined) {
    const btn = document.getElementById('btn') as HTMLButtonElement | null
    btn?.removeAttribute('disabled')

    console.log("ok")
    this.demandeService.annuler({id: Number(id)}).subscribe({
      next:(data)=>{
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Votre demande est annulée.",
          showConfirmButton: false,
          timer: 2000
        })
        this.visible = true;
        // this.demandes = this.demandes.filter(demande => demande.id !== id);
        this.getDemandeTab(this.ac.snapshot.params['id']);
      }
    })
    //this.getDemandeTab(id)
  }
  clickMethod(demande: DemandeDto) {
    const message = "Souhaitez-vous supprimée votre demande en cours de traitement ? "; 
    if (confirm(message)) {
      this.onDelete(demande.id);
    } else {
      this.router.navigate(['mes-demandes']);
    }
  }
  
}
