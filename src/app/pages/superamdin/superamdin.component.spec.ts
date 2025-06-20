import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperamdinComponent } from './superamdin.component';

describe('SuperamdinComponent', () => {
  let component: SuperamdinComponent;
  let fixture: ComponentFixture<SuperamdinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperamdinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperamdinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
