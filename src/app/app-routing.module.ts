import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { AddDemandeurComponent } from './pages/add-demandeur/add-demandeur.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {RestPasswordComponent} from "./pages/rest-password/rest-password.component";
import {NewPasswordComponent} from "./pages/new-password/new-password.component";
import {ListDemandeComponent} from "./pages/list-demande/list-demande.component";
import {UpdateDemandeurComponent} from "./pages/update-demandeur/update-demandeur.component";
import {VerificationComponent} from "./pages/verification/verification.component";
import {AccessDenyComponent} from "./pages/access-deny/access-deny.component";
import {AdminGuardGuard} from "./security/admin-guard.guard";
import {TokenGuardGuard} from "./security/token-guard.guard";
import {ChangePasswordComponent} from "./pages/change-password/change-password.component";
import {QrCodeComponent} from "./pages/qr-code/qr-code.component";
import {VisualiserComponent} from "./pages/visualiser/visualiser.component";
import { AccessGuard } from './security/access.guard';
import { UpdateByAdminComponent } from './pages/update-by-admin/update-by-admin.component';
import { SuperamdinComponent } from './pages/superamdin/superamdin.component';
import { AddadminComponent } from './pages/administrateur/add-admin/addadmin.component';
import { UpdateadminComponent } from './pages/administrateur/update-admin/updateadmin.component';
import { UpdateProfileComponent } from './pages/administrateur/update-profile/update-profile.component';
import { AddProfileComponent } from './pages/administrateur/add-profile/add-profile.component';
import { ListeTraitantComponent } from './pages/administrateur/liste-traitant/liste-traitant.component';
import { AddTitreComponent } from './pages/add-titre/add-titre.component';
import { IntercoComponent } from './pages/interco/interco.component';
import { VionnageComponent } from './pages/vionnage/vionnage.component';
import { ConsultantComponent } from './pages/consultant/consultant.component';
import { ConsultantListComponent } from './pages/consultant-list/consultant-list.component';
import { StatistiqueComponent } from './pages/statistique/statistique.component';
import { StatistiqueDepartmentComponent } from './pages/statistique-department/statistique-department.component';
import { TimerComponent } from './pages/timer/timer.component';
import { SideBarComponent } from './pages/side-bar/side-bar.component';
// import { StatistiqueMapComponent } from './pages/statistique-map/statistique-map.component';

const routes: Routes = [
  // {path: 'connexion', component:LoginComponent,canActivate:[AccessGuard]},
  {path: 'connexion', component:LoginComponent},
  {path: 'interco', component:IntercoComponent},
  {path: 'inscription', component:RegisterComponent,canActivate:[AccessGuard]},
  {path: 'accueil', component:AccueilComponent},
  {path: 'demandeur', component:AddDemandeurComponent, canActivate:[TokenGuardGuard]},
  {path: 'update-demandeur', component:UpdateDemandeurComponent, canActivate:[TokenGuardGuard]},
  {path: 'update-by-admin/:id', component:UpdateByAdminComponent, canActivate:[AdminGuardGuard]},
  {path: 'verification/:id', component:VerificationComponent, canActivate:[AdminGuardGuard,TokenGuardGuard]},
  {path: 'reset-password', component:RestPasswordComponent,canActivate:[AccessGuard]},
  {path: 'change-password', component:ChangePasswordComponent, canActivate:[TokenGuardGuard]},
  {path: 'new-password/:token', component:NewPasswordComponent},
  {path: 'verifierscan/:code', component:QrCodeComponent},
  {path: 'visualiser/:id', component:VisualiserComponent, canActivate:[TokenGuardGuard]},
  {path: 'mes-demandes/:id', component:ListDemandeComponent, canActivate:[TokenGuardGuard]},
  {path: 'traitant/dashboard', component:DashboardComponent, canActivate:[TokenGuardGuard,AdminGuardGuard]},
  {path: 'admin/dashboard', component:SuperamdinComponent, canActivate:[TokenGuardGuard,AdminGuardGuard]},
  {path: 'add-admin', component:AddadminComponent, canActivate:[TokenGuardGuard,AdminGuardGuard]},
  {path: 'update-admin/:id', component:UpdateadminComponent, canActivate:[TokenGuardGuard,AdminGuardGuard]},
  {path: 'add-titre', component:AddTitreComponent, canActivate:[TokenGuardGuard,AdminGuardGuard]},
  {path: 'consultant', component: ConsultantComponent},
  {path: 'list-consultant', component: ConsultantListComponent},
  {path: 'statistiques', component: StatistiqueComponent},
  {path: 'menu', component: SideBarComponent},


  {path: 'statistiques-department', component: StatistiqueDepartmentComponent},
  {path: 'timer', component: TimerComponent},



  // {path: 'add-profile', component:AddProfileComponent, canActivate:[TokenGuardGuard,AdminGuardGuard]},
  // {path: 'update-profile/:id', component:UpdateProfileComponent, canActivate:[TokenGuardGuard,AdminGuardGuard]},
  // {path: 'traitant', component:ListeTraitantComponent, canActivate:[TokenGuardGuard,AdminGuardGuard]},

  {path: 'access-denied', component:AccessDenyComponent},
  {path: '', redirectTo: 'connexion', pathMatch: 'full'},
  // {path: '', redirectTo: 'interco', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
