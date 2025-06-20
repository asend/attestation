import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeTraitantComponent } from './liste-traitant.component';

describe('ListeTraitantComponent', () => {
  let component: ListeTraitantComponent;
  let fixture: ComponentFixture<ListeTraitantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeTraitantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeTraitantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
