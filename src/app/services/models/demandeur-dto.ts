/* tslint:disable */
/* eslint-disable */
import { Demande } from '../models/demande';
import { FileUpload } from '../models/file-upload';
import { UtilisateurDto } from '../models/utilisateur-dto';
export interface DemandeurDto {
  adresse: string;
  completed?: boolean;
  datedenaissance?: string;
  demandeDTO?: Demande;
  displayPicture?: Array<string>;
  email?: string;
  fieluploads?: Array<FileUpload>;
  fonction?: string;
  fullName?: string;
  id?: number;
  lieudenaissance: string;
  nin?: string;
  nom?: string;
  prenom?: string;
  scannernin?: string;
  sexe: string;
  statut?: string;
  telephone: string;
  type?: string;
  userId?: number;
  utilisateurDTO?: UtilisateurDto;
  region?: string;
  departement?: string;
  matriculeSolde?: string;
}
