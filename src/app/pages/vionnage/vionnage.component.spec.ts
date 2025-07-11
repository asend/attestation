import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VionnageComponent } from './vionnage.component';

describe('VionnageComponent', () => {
  let component: VionnageComponent;
  let fixture: ComponentFixture<VionnageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VionnageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VionnageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
