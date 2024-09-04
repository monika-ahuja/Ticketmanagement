import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  currentUser: any;


  constructor(private authService: AuthService,
    private route:Router,
    private toastr:ToastrService,
    //private inactivityTimerService: InactivityTimerService, private location: Location
  
  ) {
   
  }
  ngOnInit()
  {
    if (!this.authService.isLoggedIn()) {
      this.route.navigate(['/login']);
    }
    
// Prevent back navigation to login page
history.pushState(null, '', window.location.href);
window.onpopstate = () => {
  history.go(1);
};
    this.currentUser = this.authService.getUser();
    //console.log('cureuser',this.currentUser)
   // this.loadUsers();
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
