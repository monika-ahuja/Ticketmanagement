import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InactivityTimerService } from '../../services/inactivity-timer.service';
import { Subscription } from 'rxjs';
//import { AuthService } from './auth.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: any;
  currentUser: any;
  username: any;
  users: any[] = [];
  //for ticket
  ticketForm: FormGroup;
  //currentUser: any = { username: 'user123', email: 'user@example.com', mobile: '1234567890' }; // Replace with actual user data
  tickets: any[] = [];

  unreadMessagesCount: number = 0;
  newMessageNotification: boolean = false;

  private inactivitySubscription!: Subscription;
  public timeSinceLastActivity!: number;
  private inactivityTimer: any;
  private dialogRef: MatDialogRef<TicketDialogComponent> | any;
  private routerSubscription: Subscription;
  currentUserId: any;
  currentUsername: any;


  //ticketDialog: ComponentType<unknown>;
  //@ViewChild('ticketDialog') ticketDialog!: TemplateRef<any>;
  constructor(private authService: AuthService,
    private route: Router,
    private toastr: ToastrService,
    private inactivityTimerService: InactivityTimerService, private location: Location,
    // private wsService: WebSocketService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private ticketService: TicketService

  ) {
    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });




    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && this.dialogRef) {
        console.log('dialog cls')
        this.dialogRef.close();
      }
    });
  }
  ngOnInit(): void {

    // Check if user is not logged in, navigate back to login page
    if (!this.authService.isLoggedIn()) {
      this.route.navigate(['/login']);
    }

    // Prevent back navigation to login page
    history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      history.go(1);
    };

    // Fetch current user
    this.currentUser = this.authService.getUser();
    this.currentUserId = this.currentUser ? this.currentUser.id : null;
    this.currentUsername = this.currentUser ? this.currentUser.username : null;
    console.log('cureuserid', this.currentUserId)
console.log('currentuser', this.currentUsername)
    //logogut
    // Start inactivity tracking
    this.inactivityTimerService.startInactivityTracking();

    // Subscribe to inactivity timeout event
    this.inactivitySubscription = this.inactivityTimerService.inactivityTimeoutExpired$.subscribe(() => {
      this.handleLogoutDueToInactivity();
    });

    // Update time since last activity every second
    setInterval(() => {
      this.timeSinceLastActivity = this.inactivityTimerService.getTimeSinceLastActivity();
    }, 1000);


  }

  private handleLogoutDueToInactivity(): void {
    this.toastr.info('You have been logged out due to inactivity.');
    this.logout();
  }


  //get all users

  fetchUsers(): void {
    this.authService.getUsers().subscribe(
      (users) => {
        this.users = users;
        console.log('Fetched users:', this.users);
      },
      (error) => {
        console.error('Error fetching users:', error);


      }
    );
  }

  //delete the user
  deleteUser(userId: number): void {
    this.authService.deleteUser(userId).subscribe(
      () => {
        this.toastr.success(`User deleted successfully.`);
        this.fetchUsers();
      },
      (error) => {
        console.error(`Error deleting user with ID `, error);
        this.toastr.error(`Failed to delete user with ID .`);
      }
    );
  }
  //for avatar text on nav
  getAvatarText(username: string): string {
    if (!username) return '';
    const firstLetter = username.charAt(0).toUpperCase();
    const lastLetter = username.charAt(username.length - 1).toUpperCase();
    return `${firstLetter}${lastLetter}`;
  }


  //lgout 
  logout() {

    this.authService.logout();
    console.log('logout')
  }

  ngOnDestroy(): void {

    this.inactivitySubscription.unsubscribe();
    this.inactivityTimerService.stopInactivityTracking();

    //for dialog
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  openTicketDialog(): void {
    this.dialog.open(TicketDialogComponent, {
      data: { userId: this.currentUserId ,
        username: this.currentUsername
      },
      //});
      width: '500px',
      height: '400px',
      disableClose: true, // Prevent closing the dialog by clicking outside
      backdropClass: 'backdropBackground' // Add custom class for styling
    });
  }
}
