import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSidebarComponent } from './transaction-sidebar.component';

describe('TransactionSidebarComponent', () => {
  let component: TransactionSidebarComponent;
  let fixture: ComponentFixture<TransactionSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
