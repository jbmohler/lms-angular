import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaSidebarComponent } from './persona-sidebar.component';

describe('PersonaSidebarComponent', () => {
  let component: PersonaSidebarComponent;
  let fixture: ComponentFixture<PersonaSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonaSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
