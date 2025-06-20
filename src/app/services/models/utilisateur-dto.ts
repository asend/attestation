/* tslint:disable */
/* eslint-disable */
import { DemandeurDto } from '../models/demandeur-dto';
import { ProfileDto } from '../models/profile-dto';
export interface UtilisateurDto {
  demandeurDTO?: DemandeurDto;
  email?: string;
  fullName?: string;
  id?: number;
  nin?: string;
  nom?: string;
  passPort?: string;
  prenom?: string;
  profileDTO?: ProfileDto;
  signature?: string;
  statut?: boolean;
  titre?: string;
  typePieces?: string;
  telephone?: string;
  matriculeSolde?: string;
}
