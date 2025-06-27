import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DemandeDto} from "../../services/models/demande-dto";

export interface InfoStatistique{
  title?: string;
  nombre?: number;
  slug?: string;
  infoStyle?: 'bg-primary' | 'bg-success' | 'bg-warning' | 'bg-danger' | 'bg-info';
  textcolor?: 'clwhite' | 'clred' | 'clgreen' | 'clyellow';
  statuscolor?: 'encourblue' | 'approuedgreen' | 'rejectred';
  icons?:'iconapprouved' | 'iconrejected' | 'iconencours' | 'icontout';
  icon?: 'fas fa-layer-group text-dark' | 'fas fa-spinner fa-spin text-primary' | 'fas fa-check-circle text-success' | 'fas fa-times-circle text-danger' ;
}
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() infoStatistique: InfoStatistique= {}

  @Input() tDemande: DemandeDto[] = []

  @Output() stringChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    
  }

  emitInfo(slug: string | undefined){
    this.stringChange.emit(slug);
    
  }

  test(){
    
  }

}
