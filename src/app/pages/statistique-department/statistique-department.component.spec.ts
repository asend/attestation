import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiqueDepartmentComponent } from './statistique-department.component';

describe('StatistiqueDepartmentComponent', () => {
  let component: StatistiqueDepartmentComponent;
  let fixture: ComponentFixture<StatistiqueDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatistiqueDepartmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatistiqueDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
