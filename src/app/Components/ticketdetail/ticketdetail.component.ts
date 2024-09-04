import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/Models/Ticket.model';
import { AuthService } from 'src/app/services/auth.service';

import { TicketService } from 'src/app/services/ticket.service';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-ticketdetail',
  templateUrl: './ticketdetail.component.html',
  styleUrl: './ticketdetail.component.css'
})
export class TicketdetailComponent {

  ticket: any;
  ticketId: any;
  message: string = '';
  messages: any[] = [];
  isExpanded: boolean[] = [];
  currentUser: any;
  statusUpdateMessage: string | null = null;
  private messageSubscription!: Subscription;
  private socketSubscription!: Subscription;

  constructor(private route: ActivatedRoute, 
    private ticketService: TicketService,
    private authService: AuthService,
    private webSocketService: WebSocketService
  ) { }


  ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.authService.getUser();
   
    this.loadTicketDetails();

    this.messageSubscription = this.webSocketService.getMessages().subscribe((data: any) => {
      const messageData = JSON.parse(data);
  console.log(' messagedata  ',messageData)
    
    //     this.messages.push(messageData.message);
    //     console.log('user dashboard  upadted messaged data after receive on admin',this.messages)
  
    // });
  //  this.reverseMessages();
    if (messageData.ticketId === parseInt(this.ticketId as string, 10)) {
      console.log('Matching ticket ID:', messageData.ticketId);
      if (messageData.status) {
        console.log('Updating status:', messageData.status);
        // Update the status if the message contains a status update
        this.ticket.status = messageData.status;

        this.statusUpdateMessage = `Ticket status updated to ${messageData.status}`;
        setTimeout(() => this.statusUpdateMessage = null, 5000); // Hide message after 5 seconds
 
      }
      
    }
    if (messageData.message) {
      // Append new messages to the messages array
      this.messages.push(messageData.message);
      this.reverseMessages();  // Reverse messages to show the latest first
    }
  });
  }

  loadTicketDetails(): void {
    if (this.ticketId) {
      this.ticketService.getTicketById(this.ticketId).subscribe(ticket => {
        this.ticket = ticket;
        this.messages = ticket.messages || [];
      });
    }
  }

  reverseMessages(): void {
    this.messages.reverse();
  }

  sendMessage(): void {
    if (!this.message.trim()) {
      console.error('Message content is empty');
      return;
    }


    if (this.ticket.status === 'Closed') {
      console.error('Cannot send messages on a closed ticket');
      return;
    }

    const message: Message = {
  
     sender:this.currentUser.username,
      text: this.message, 
      timestamp: new Date()
    };
    this.ticketService.addMessageToTicket(this.ticketId, message).subscribe({
      next: (updatedTicket) => {
        this.ticket = updatedTicket;
        this.reverseMessages();
        this.webSocketService.sendMessage({ ticketId: this.ticketId,message });
        console.log('Message added successfully:', updatedTicket);
        this.message = '';
      },
      error: (error) => {
        console.error('Error adding message:', error);
      }
    });
  
  }

  toggleCollapse(index: number): void {
    this.isExpanded[index] = !this.isExpanded[index];
  }
  ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }


}
