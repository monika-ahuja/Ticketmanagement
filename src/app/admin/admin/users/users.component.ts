import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuditLogService } from 'src/app/services/audit-log.service';
import { AuthService } from 'src/app/services/auth.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: any;
  selectedUserId: number | null = null;
  selectedUserTickets: any[] = [];


  constructor(private authService: AuthService, private toastr: ToastrService,
    private http:HttpClient,
    private auditLogService: AuditLogService,
    private ticketService:TicketService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    
  }

//GET all the users 
  loadUsers(): void {
    this.authService.getUsers().subscribe(
      (data: any) => {
        this.users = data;
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    );
  }

 // DELETE the user
 deleteUser(userId: any): void {
  this.authService.deleteUser(userId).subscribe(
    () => {
      console.log(userId,'this is deleted')
     
        this.toastr.success(`User deleted successfully.`);
        this.loadUsers();
        this.auditLogService.logDeleteUserAction(userId).subscribe(() => {
      }, error => {
        console.error(`Error logging delete action for user with ID ${userId}:`, error);
        this.toastr.error(`Failed to log delete action for user.`);
      });
    },
    (error: any) => {
      console.error(`Error deleting user with ID ${userId}:`, error);
      this.toastr.error(`Failed to delete user with ID ${userId}.`);
    }
  );
}

// Navigate to tickets page for selected user
viewTickets(userId: number): void {
  this.router.navigate(['/home/tickets', userId]);
}


}