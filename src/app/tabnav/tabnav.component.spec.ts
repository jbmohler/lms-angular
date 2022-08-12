import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabnavComponent } from './tabnav.component';

describe('TabnavComponent', () => {
  let component: TabnavComponent;
  let fixture: ComponentFixture<TabnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabnavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
