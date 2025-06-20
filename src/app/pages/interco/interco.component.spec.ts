import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntercoComponent } from './interco.component';

describe('IntercoComponent', () => {
  let component: IntercoComponent;
  let fixture: ComponentFixture<IntercoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntercoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntercoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
