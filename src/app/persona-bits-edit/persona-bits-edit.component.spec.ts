import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaBitsEditComponent } from './persona-bits-edit.component';

describe('PersonaBitsEditComponent', () => {
  let component: PersonaBitsEditComponent;
  let fixture: ComponentFixture<PersonaBitsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonaBitsEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaBitsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
