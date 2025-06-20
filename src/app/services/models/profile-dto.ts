/* tslint:disable */
/* eslint-disable */
import { UtilisateurDto } from '../models/utilisateur-dto';
export interface ProfileDto {
  code?: string;
  etat?: string;
  id?: number;
  libelle?: string;
  utilisateurDTO?: UtilisateurDto;
}
