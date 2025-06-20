/* tslint:disable */
/* eslint-disable */
import { Demande } from '../models/demande';
import { Demandeur } from '../models/demandeur';
import { GrantedAuthority } from '../models/granted-authority';
import { PasswordResetToken } from '../models/password-reset-token';
import { Profile } from '../models/profile';
export interface Utilisateur {
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  authorities?: Array<GrantedAuthority>;
  credentialsNonExpired?: boolean;
  demande?: Array<Demande>;
  demandeur?: Demandeur;
  email?: string;
  enabled?: boolean;
  fullName?: string;
  id?: number;
  nin?: string;
  nom: string;
  passPort?: string;
  password?: string;
  passwordResetTokens?: Array<PasswordResetToken>;
  prenom: string;
  profile?: Profile;
  signature?: string;
  statut?: boolean;
  titre?: string;
  typePieces?: string;
  username?: string;
  telephone?: string;
  matriculeSolde?: string;

}
