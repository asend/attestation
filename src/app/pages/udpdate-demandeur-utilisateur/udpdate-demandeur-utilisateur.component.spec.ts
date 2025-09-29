import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UdpdateDemandeurUtilisateurComponent } from './udpdate-demandeur-utilisateur.component';

describe('UdpdateDemandeurUtilisateurComponent', () => {
  let component: UdpdateDemandeurUtilisateurComponent;
  let fixture: ComponentFixture<UdpdateDemandeurUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UdpdateDemandeurUtilisateurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UdpdateDemandeurUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
