import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketdetailsComponent } from './ticketdetails.component';

describe('TicketdetailsComponent', () => {
  let component: TicketdetailsComponent;
  let fixture: ComponentFixture<TicketdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
