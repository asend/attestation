/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { UtilisateurService } from './services/utilisateur.service';
import { ProfileService } from './services/profile.service';
import { DemandeurService } from './services/demandeur.service';
import { UserControllerService } from './services/user-controller.service';
import { UploadControllerService } from './services/upload-controller.service';
import { FileuploadService } from './services/fileupload.service';
import { TitreService } from './services/titre.service';
import { NotifService } from './services/notif.service';
import { DemandeService } from './services/demande.service';
import { MailService } from './services/mail.service';
import { SendMailService } from './services/send-mail.service';
import { DashbordService } from './services/dashbord.service';
import { CompteurService } from './services/compteur.service';
import { CertificationService } from './services/certification.service';
import { AttestationService } from './services/attestation.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    UtilisateurService,
    ProfileService,
    DemandeurService,
    UserControllerService,
    UploadControllerService,
    FileuploadService,
    TitreService,
    NotifService,
    DemandeService,
    MailService,
    SendMailService,
    DashbordService,
    CompteurService,
    CertificationService,
    AttestationService,
    ApiConfiguration
  ],
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    }
  }

  constructor( 
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
      'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
