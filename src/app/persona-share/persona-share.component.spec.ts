import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaShareComponent } from './persona-share.component';

describe('PersonaShareComponent', () => {
  let component: PersonaShareComponent;
  let fixture: ComponentFixture<PersonaShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonaShareComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
