import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Message, Ticket } from 'src/app/Models/Ticket.model';
import { AuthService } from 'src/app/services/auth.service';
//import { SocketService } from 'src/app/services/socket.service';
import { TicketService } from 'src/app/services/ticket.service';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {

  ticketStatuses: string[] = ['Open', 'In Progress', 'Escalated', 'Closed'];
  selectedUserId: number | null = null;
  tickets: any[] = [];


  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private socketService: WebSocketService,
    private toastr: ToastrService
  ) { }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedUserId = +params['userId'];
      this.loadTickets();
    });
  }

  loadTickets(): void {
    if (this.selectedUserId !== null) {
      this.ticketService.getTicketsByUser(this.selectedUserId).subscribe(
        (data: any) => {
          this.tickets = data;
          console.log('tickets ', this.tickets)
        },
        (error: any) => {
          console.error('Error fetching tickets:', error);
          this.toastr.error('Failed to load tickets', 'Error');
        }
      );
    }
  }


  viewTicketDetails(ticketId: number): void {
    this.ticketService.setUserId(this.selectedUserId!);
    // Store state in local storage before navigation
    //localStorage.setItem('fromPage', 'user-tickets'); // or 'all-tickets'
        sessionStorage.setItem('fromPage', 'user-tickets'); // or 'all-tickets'
    this.router.navigate(['/home/tickets/ticket-details', ticketId])

  }


  goBack(): void {
    this.router.navigateByUrl('/home/users')
  }
}
