import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketdetailComponent } from './ticketdetail.component';

describe('TicketdetailComponent', () => {
  let component: TicketdetailComponent;
  let fixture: ComponentFixture<TicketdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketdetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
