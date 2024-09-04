import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Message, Ticket } from 'src/app/Models/Ticket.model';
import { AuthService } from 'src/app/services/auth.service';
import { TicketService } from 'src/app/services/ticket.service';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-ticketdetails',
  templateUrl: './ticketdetails.component.html',
  styleUrl: './ticketdetails.component.css'
})
export class TicketdetailsComponent {
  //ticket!: Ticket;
  ticket: Ticket = {} as Ticket; // Initialize with an empty object
  message!: string;
  private messageSubscription!: Subscription;
  private ticketId: any; // Example ticket ID
  messages: Message[] = [];
  newStatus: any;
  msg: any;
  currentUser: any;
  selectedUserId!: number;
  userId!: any;

  fromPage!: any;
  constructor(
    private ticketService: TicketService,
    private webSocketService: WebSocketService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private toastr:ToastrService
  ) {

    // const navigation = this.router.getCurrentNavigation();
    // const navigationState = navigation?.extras.state as { from?: string };

    // console.log('Navigation State constr:', navigationState); // Log the navigation state to check if it's null

  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.ticketId = +params['ticketId'];
      this.userId = localStorage.getItem('userId') || this.ticketService.getUserId();
      console.log('Ticket ID from route params:', this.ticketId);
      console.log('userId ID from route params:', this.userId);
      this.currentUser = this.authService.getUser();
      this.loadTicketDetails();
    });
    // Retrieve from local storage
    this.fromPage = sessionStorage.getItem('fromPage');
    console.log('from page', this.fromPage)


    // Subscribe to query parameters
    //  this.route.queryParams.subscribe(params => {
    //   this.fromPage = params['from']; // Get the value of 'from' query parameter
    //   console.log('Navigated from:', this.fromPage);
    // });

    this.messageSubscription = this.webSocketService.getMessages().subscribe((data: any) => {
      const messageData = JSON.parse(data);
      console.log('on admin dashboard get mesage data from user', messageData)

      //if (messageData.ticketId === this.ticketId) {
      this.messages.push(messageData.message);
      this.reverseMessages();
      //  this.messages.unshift(messageData.message); // Add new messages to the beginning
      // this.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // Sort messages by timestamp, oldest first
      console.log('Updated messages array after receiving data from user:', this.messages);
      //}
      // if (messageData.status) {
      //   //this.ticket.status = messageData.status;
      //   this.newStatus = messageData.status; // Update the status in the UI
      // }
    });


  }

  reverseMessages(): void {
    this.messages.reverse();
  }

  loadTicketDetails(): void {
    if (this.ticketId) {
      this.ticketService.getTicketById(this.ticketId).subscribe(ticket => {
        console.log('Ticket details loaded:', ticket);
        this.ticket = ticket;
        this.messages = ticket.messages || [];
        this.newStatus = ticket.status; // Initialize newStatus with current status
        console.log('Initial messages array:', this.messages);
      },
      (error:any) => {
        console.error('Error loading ticket details:', error);
        this.ticket = {} as Ticket;  // Handling error scenario
      }
    );
    }
  }

  sortMessages(): void {
    this.messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Newest messages first
  }

  sendMessage(): void {
    if (this.message.trim()) {
      const message: Message = {

        sender: this.currentUser.username,
        text: this.message,
        timestamp: new Date()
      };
      console.log('Sending message:', message);
      this.ticketService.addMessageToTicket(this.ticketId, message).subscribe({
        next: (updatedTicket) => {
          this.ticket = updatedTicket;
          this.reverseMessages();
          this.webSocketService.sendMessage({ ticketId: this.ticketId, message: message });

this.toastr.success("Message add successfully")
          console.log('Message added successfully:', updatedTicket);

        },
        error: (error) => {
          console.error('Error adding message:', error);
        }
      });

      this.message = '';
    }
  }

  updateStatus(event: any): void {
    const newStatus = event.target.value;
    if (this.ticketId && newStatus !== this.ticket.status) {
      this.ticketService.updateStatus(this.ticketId, newStatus).subscribe(
        () => {
          this.ticket.status = newStatus;
          this.newStatus = newStatus; // Update newStatus with the new status


        },
        error => {
          console.error('Error updating status:', error);
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }



  goBack(): void {
    if (this.fromPage === 'user-tickets') {
      this.router.navigate(['/home/tickets/', this.userId]); // Navigate back to user tickets page
      console.log('uswr tickei')
    } else if (this.fromPage === 'all-tickets') {
      this.router.navigate(['/home/tickets']); // Navigate back to all tickets page
      console.log('all tickei')
    } else {
      window.history.back(); // Fallback to previous page
    }


    // Clear local storage state after navigation
    sessionStorage.removeItem('fromPage');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Open':
        return 'green';
      case 'In Progress':
        return 'blue';
      case 'Escalated':
        return 'Orange';
      case 'Closed':
        return 'red';
      default:
        return 'black';
    }
  }
  

}
