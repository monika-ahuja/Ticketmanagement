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
  greetingMessage!: string;
  isHomePage: boolean = false;

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

    this.greetingMessage = this.getGreeting();
    this.route.events.subscribe(() => {
      // Check if the current URL is '/home'
      this.isHomePage = this.route.url === '/home';
    });
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

   // Method to determine greeting based on time
   getGreeting(): string {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }

   // Method to capitalize the first letter of the username
   capitalizeUsername(username: string): string {
    if (!username) return '';
    return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
  }

  
}
