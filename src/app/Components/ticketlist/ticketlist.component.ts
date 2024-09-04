import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TicketService } from 'src/app/services/ticket.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { Ticket } from 'src/app/Models/Ticket.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticketlist',
  templateUrl: './ticketlist.component.html',
  styleUrl: './ticketlist.component.css'
})

export class TicketlistComponent {

  tickets: any[] = [];
  filteredTickets: any[] = [];
  titleFilter: string = '';
  statusFilter: string = 'All';

  constructor(
    private authService: AuthService,
    private ticketService: TicketService,
    private location:Location,
    private router:Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    if (currentUser) {
      console.log('ticketlist id user',currentUser.id)
      this.ticketService.getUserTickets(currentUser.id).subscribe((tickets:any) => {
        this.tickets = tickets;
        this.filteredTickets = tickets;  // Initially, show all tickets
        console.log('ticketslist dashboard',this.tickets)
      });
    }
    //this.fetchTickets();
  }


  onTitleFilterChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.titleFilter = target.value.toLowerCase();
    this.applyFilters();
  }

  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.statusFilter = target.value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      const matchesTitle = this.titleFilter === '' || ticket.title.toLowerCase().includes(this.titleFilter);
      const matchesStatus = this.statusFilter === 'All' || ticket.status === this.statusFilter;
      return matchesTitle && matchesStatus;
    });
  }




  goBack(): void {
    this.router.navigateByUrl('/dashboard')
  }

  cancelTicket(ticketId: number): void {
    this.ticketService.cancelTicket(ticketId).subscribe(() => {
      this.tickets = this.tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: 'Cancelled' } : ticket
      );
      this.filteredTickets = this.filteredTickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: 'Cancelled' } : ticket
      );
    });
  }

}
