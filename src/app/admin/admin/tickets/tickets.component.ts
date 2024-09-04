import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-tickets',

  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent {
  tickets: any[] = [];

  ticket: any;
  ticketId!: string;
  newStatus!: string;
  filteredTickets: any[] = [];  // Array to store the filtered tickets
  usernameFilter: string = '';  // Default username filter
  statusFilter: string = 'Open'; // Default status filter to 'Open'
  startDate: string = ''; // Start date filter
  endDate: string = ''; // End date filter

  constructor(private ticketService: TicketService,
    private route: ActivatedRoute,
    private router: Router

  ) {

  }


  ngOnInit() {
    this.fetchTickets();

  }
  fetchTickets(): void {
    this.ticketService.getAllTickets().subscribe(
      (tickets: any[]) => {
        this.tickets = tickets;
        this.filteredTickets = tickets; // Initially show all tickets
        this.filterTickets(); // Apply the filter after fetching tickets
        console.log('alltikcets', this.tickets);
      },
      (error: any) => {
        console.error('Error fetching tickets', error);
        // Handle error
      }
    );
  }

  onStatusChange(event: any): void {
    this.statusFilter = event.target.value;

    this.filterTickets();
  }

  onUsernameChange(event: any): void {
    this.usernameFilter = event.target.value.toLowerCase();
    this.filterTickets();
  }

  onStartDateChange(event: any): void {
    this.startDate = event.target.value;
    console.log('startdate',this.startDate)
    this.filterTickets();
    console.log('filterticketsafter start',)
  }

  onEndDateChange(event: any): void {
    this.endDate = event.target.value;
    console.log('enddate',this.endDate)
    this.filterTickets();
  }


  // filterTickets(): void {
  //   this.filteredTickets = this.tickets.filter(ticket => {
  //     const matchesStatus = this.statusFilter === 'All' || ticket.status === this.statusFilter;
  //     const matchesUsername = this.usernameFilter === '' || (ticket.username && ticket.username.toLowerCase().includes(this.usernameFilter));
  //     return matchesStatus && matchesUsername;
  //   });
  // }
  // filterTickets(): void {
  //   this.filteredTickets = this.tickets.filter(ticket => {
  //     const matchesStatus = this.statusFilter === 'All' || ticket.status === this.statusFilter;
  //     const matchesUsername = this.usernameFilter === '' || (ticket.username && ticket.username.toLowerCase().includes(this.usernameFilter));

  //     const ticketDate = new Date(ticket.createdAt);  // Assuming 'createdAt' is the field name for the ticket's date
  //     const matchesStartDate = !this.startDate || ticketDate >= new Date(this.startDate);
  //     const matchesEndDate = !this.endDate || ticketDate <= new Date(this.endDate);

  //     return matchesStatus && matchesUsername && matchesStartDate && matchesEndDate;
  //   });
  // }

  filterTickets(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      const matchesStatus = this.statusFilter === 'All' || ticket.status === this.statusFilter;
      const matchesUsername = this.usernameFilter === '' || (ticket.username && ticket.username.toLowerCase().includes(this.usernameFilter));
  
      const ticketDate = new Date(ticket.createdAt);
  
      const matchesStartDate = !this.startDate || ticketDate >= new Date(this.startDate);
  
      let matchesEndDate = true;  // Assume true unless endDate is set
      if (this.endDate) {
        const endDateAdjusted = new Date(this.endDate);
        endDateAdjusted.setHours(23, 59, 59, 999);
        matchesEndDate = ticketDate <= endDateAdjusted;
      }
  
      return matchesStatus && matchesUsername && matchesStartDate && matchesEndDate;
    });
  }
  
  


  // Method to navigate to ticket details page
  navigateToTicketDetails(ticketId: number) {

    sessionStorage.setItem('fromPage', 'all-tickets');
    this.router.navigate(['/home/tickets/ticket-details', ticketId]);
  }


}
