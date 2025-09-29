/* tslint:disable */
/* eslint-disable */
import { CertificationDto } from '../models/certification-dto';
import { DemandeurDto } from '../models/demandeur-dto';
export interface DemandeDto {
  attestaionName?: string;
  certificationDTO?: CertificationDto;
  datedemande?: string;
  dateexpiration?: string;
  datetraitement?: string;
  demandeurDTO?: DemandeurDto;
  descriptiondemande?: string;
  id?: number;
  numerodemande?: string;
  objetdemande?: string;
  statut?: string;
  urlattestation?: string;
  validite?: boolean;
  motifrejet?: string;
  startTime?: string;
  tempsEcoule?: string;
  dureeTraitement?: String;
  
}


