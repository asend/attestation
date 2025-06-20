import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTitreComponent } from './add-titre.component';

describe('AddTitreComponent', () => {
  let component: AddTitreComponent;
  let fixture: ComponentFixture<AddTitreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTitreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTitreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
