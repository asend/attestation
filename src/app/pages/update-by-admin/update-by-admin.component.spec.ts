import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateByAdminComponent } from './update-by-admin.component';

describe('UpdateByAdminComponent', () => {
  let component: UpdateByAdminComponent;
  let fixture: ComponentFixture<UpdateByAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateByAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateByAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
