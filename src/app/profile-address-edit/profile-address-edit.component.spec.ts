import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAddressEditComponent } from './profile-address-edit.component';

describe('ProfileAddressEditComponent', () => {
  let component: ProfileAddressEditComponent;
  let fixture: ComponentFixture<ProfileAddressEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileAddressEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileAddressEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
