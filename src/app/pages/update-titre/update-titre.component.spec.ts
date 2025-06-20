import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTitreComponent } from './update-titre.component';

describe('UpdateTitreComponent', () => {
  let component: UpdateTitreComponent;
  let fixture: ComponentFixture<UpdateTitreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTitreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTitreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
