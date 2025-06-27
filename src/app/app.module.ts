import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpInterceptorService} from "./auth/service/http-interceptor.service";
import { NavComponent } from './pages/layout/nav/nav.component';
import { FooterComponent } from './pages/layout/footer/footer.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { AddDemandeurComponent } from './pages/add-demandeur/add-demandeur.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RestPasswordComponent } from './pages/rest-password/rest-password.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
import { UpdateDemandeurComponent } from './pages/update-demandeur/update-demandeur.component';
import { ListDemandeComponent } from './pages/list-demande/list-demande.component';
import { CardComponent } from './pages/card/card.component';
import { VerificationComponent } from './pages/verification/verification.component';
import { QrCodeComponent } from './pages/qr-code/qr-code.component';
import { AccessDenyComponent } from './pages/access-deny/access-deny.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import { VisualiserComponent } from './pages/visualiser/visualiser.component';
import {NgxPaginationModule} from "ngx-pagination";
import {NgxCaptchaModule} from "ngx-captcha";
import { UpdateByAdminComponent } from './pages/update-by-admin/update-by-admin.component';
import { SuperamdinComponent } from './pages/superamdin/superamdin.component';
import { AddadminComponent } from './pages/administrateur/add-admin/addadmin.component';
import { AddProfileComponent } from './pages/administrateur/add-profile/add-profile.component';
import { UpdateadminComponent } from './pages/administrateur/update-admin/updateadmin.component';
import { UpdateProfileComponent } from './pages/administrateur/update-profile/update-profile.component';
import { ListeTraitantComponent } from './pages/administrateur/liste-traitant/liste-traitant.component';
import { AddTitreComponent } from './pages/add-titre/add-titre.component';
import { UpdateTitreComponent } from './pages/update-titre/update-titre.component';
import { FilterPipe } from './filter.pipe';
import { CapitalizePipe } from './capitalize.pipe';
import { IntercoComponent } from './pages/interco/interco.component';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        NavComponent,
        FooterComponent,
        AccueilComponent,
        AddDemandeurComponent,
        DashboardComponent,
        RestPasswordComponent,
        NewPasswordComponent,
        UpdateDemandeurComponent,
        ListDemandeComponent,
        CardComponent,
        VerificationComponent,
        QrCodeComponent,
        AccessDenyComponent,
        ChangePasswordComponent,
        VisualiserComponent,
        UpdateByAdminComponent,
        SuperamdinComponent,
        AddadminComponent,
        AddProfileComponent,
        UpdateadminComponent,
        UpdateProfileComponent,
        ListeTraitantComponent,
        AddTitreComponent,
        UpdateTitreComponent,
        FilterPipe,
        CapitalizePipe,
        IntercoComponent,

        
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        NgxCaptchaModule


    ],
    providers: [
        HttpClient,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorService,
            multi: true
        },
      {
        provide: LocationStrategy, useClass: HashLocationStrategy
      }
    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
