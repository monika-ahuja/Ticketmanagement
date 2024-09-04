import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  currentUser: any;
  users: any;
  tickets: any[] = [];
  constructor(private authService: AuthService,
    private route:Router,
    private toastr:ToastrService,
    private ticketService: TicketService
    //private inactivityTimerService: InactivityTimerService, private location: Location 
  ) {  
  }

  ngOnInit()
  {    
    if (!this.authService.isLoggedIn()) {
      this.route.navigate(['/login']);
      return;
    }
    
// Prevent back navigation to login page
history.pushState(null, '', window.location.href);
window.onpopstate = () => {
  history.go(1);
};
    this.currentUser = this.authService.getUser();
   // console.log('cureuser',this.currentUser)
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


  getAvatarText(username: string): string {
    if (!username) return '';
    const firstLetter = username.charAt(0).toUpperCase();
    const lastLetter = username.charAt(username.length - 1).toUpperCase();
    return `${firstLetter}${lastLetter}`;
  }

  
  logout() {

    this.authService.logout();
    console.log('logout')
  }

  
}
