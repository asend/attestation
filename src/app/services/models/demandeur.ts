/* tslint:disable */
/* eslint-disable */
import { Demande } from '../models/demande';
import { FileUpload } from '../models/file-upload';
import { Utilisateur } from '../models/utilisateur';
export interface Demandeur {
  adresse?: string;
  completed?: boolean;
  datedenaissance?: string;
  demande?: Array<Demande>;
  displayPicture?: Array<string>;
  fileUploads?: Array<FileUpload>;
  fonction?: string;
  id?: number;
  lieudenaissance?: string;
  nin?: string;
  scannernin?: string;
  sexe?: string;
  statut?: string;
  telephone?: string;
  type?: string;
  utilisateur?: Utilisateur;
  region?: string;
  departement?: string;
  matriculeSolde?: string;
  
}
