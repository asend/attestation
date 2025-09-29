/* tslint:disable */
/* eslint-disable */
import { Certification } from '../models/certification';
import { Demandeur } from '../models/demandeur';
import { Utilisateur } from '../models/utilisateur';
export interface Demande {
  attestationName?: string;
  certification?: Certification;
  datedemande?: string;
  dateexpiration?: string;
  datetraitement?: string;
  demandeur?: Demandeur;
  descriptiondemande?: string;
  id?: number;
  nin?: string;
  numerodemande?: string;
  objetdemande?: string;
  statut?: string;
  urlattestation?: string;
  utilisateur?: Utilisateur;
  valide?: boolean;
  validite?: boolean;
  motifrejet?: string;
  dureeTraitement?: String;

}
