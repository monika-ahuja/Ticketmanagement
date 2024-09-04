import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, catchError, map, switchMap } from 'rxjs';
import { Message, Ticket } from '../Models/Ticket.model';
import { io } from 'socket.io-client';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private socket: any;
  private ticketUpdateSubject = new Subject<any>();
  //private apiUrl = 'http://localhost:3000'; 
  private apiUrl = 'http://localhost:3000';
  private apiUrl1= 'http://localhost:3000/tickets';
  constructor(private http: HttpClient, private toastr: ToastrService,
    private webSocketService:WebSocketService
  )
   { 

   }


  // onMessageReceived(): Observable<any> {
  //   return new Observable(observer => {
  //     this.socket.on('message', (message: any) => {
  //       observer.next(message);
  //     });
  //   });
  // }

  // onStatusUpdated(): Observable<any> {
  //   return new Observable(observer => {
  //     this.socket.on('statusUpdate', (status: any) => {
  //       observer.next(status);
  //     });
  //   });
  // }

  //create a ticket 
  createTicket(ticketData: any): Observable<any> {
    // Add current timestamp to ticket data
    ticketData.createdAt = new Date().toISOString();
    ticketData.status = 'Open';
    const url = `${this.apiUrl}/tickets`;
    return this.http.post<any>(url, ticketData).pipe(
      catchError((error: any) => {
        console.error('Error creating ticket', error);
        this.toastr.error('Failed to create ticket', 'Error');
        throw error;
      })
    );
  }


  getTicketsForUser(userId: number): Observable<Ticket[]> {
    const url = `${this.apiUrl}/tickets?userId=${userId}`;
    return this.http.get<Ticket[]>(url);
  }

  getUserTickets(userId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets/?userId=${userId}`);
  }

  // getAllTickets(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }

  
  getMessagesByTicketId(ticketId: number): Observable<{ sender: string, content: string }[]> {
    return this.http.get<{ sender: string, content: string }[]>(`${this.apiUrl}/${ticketId}/messages`);
  }
  
  updateTicketMessages(ticketId: string, messages: Message[]): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${ticketId}`, { messages });
  }

  updateTicketStatus(ticketId: string, status: string): Observable<any> {
    const updateData = {
      status: status,
      statusUpdatedAt: new Date()
    };
    return this.http.patch<any>(`${this.apiUrl}/${ticketId}/status`, updateData);
  }

  getTicketsByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tickets/?userId=${userId}`);
  }

  getTicket(ticketId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tickets/${ticketId}`);
  }


  
  updateStatus(ticketId: number, status: string): Observable<any> {
    const updatedAt = new Date().toISOString();  // Current timestamp
    return this.http.patch<any>(`${this.apiUrl}/tickets/${ticketId}`, { status ,statusUpdatedAt: updatedAt});
  }
   // Fetch ticket details
   getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl1}/${id}`);
  }

  // Update ticket details
  updateTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl1}/${ticket.id}`, ticket);
  }

addMessageToTicket(ticketId: number, message: Message): Observable<Ticket> {
  const url = `${this.apiUrl1}/${ticketId}`;
  return this.http.get<Ticket>(url).pipe(
    switchMap((ticket: Ticket) => {
      // Ensure messages is an array
      const messages = ticket.messages || [];
      const updatedMessages = [...messages, message];
      return this.http.patch<Ticket>(url, { messages: updatedMessages }).pipe(
        map((updatedTicket) => {
          updatedTicket.messages = updatedMessages;
          return updatedTicket;
        })
      );
    }),
    catchError((error) => {
      console.error('Error adding message:', error);
      throw error;
    })
  );
}


// Fetch all tickets
getAllTickets(): Observable<Ticket[]> {
  return this.http.get<Ticket[]>(`${this.apiUrl1}`).pipe(
    catchError((error) => {
      console.error('Error fetching all tickets:', error);
      this.toastr.error('Failed to fetch tickets', 'Error');
      throw error;
    })
  );
}

cancelTicket(ticketId: number): Observable<any> {
  return this.http.patch(`${this.apiUrl1}/${ticketId}`, { status: 'Cancelled' });
}


private userId: any;

  setUserId(id: number): void {

    this.userId = id;
    localStorage.setItem('userId', this.userId);
  }

  getUserId(): number | null {
    return this.userId;
  }
}
