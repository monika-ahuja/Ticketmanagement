//import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AuthService } from './services/auth.service';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './Components/register/register.component';
import { ToastNotificationComponent } from './Components/toast-notification/toast-notification.component';
//import { AuthInterceptor } from './auth.interceptor';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InactivityTimerService } from './services/inactivity-timer.service';
import { AuthInterceptor } from './Interceptor/auth.interceptor';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TicketDialogComponent } from './Components/ticket-dialog/ticket-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TicketlistComponent } from './Components/ticketlist/ticketlist.component';
import { AdminModule } from './admin/admin-dashboard/admin.module';
import { AdminRoutingModule } from './admin/admin-dashboard/admin-routing.module';
import { TicketdetailComponent } from './Components/ticketdetail/ticketdetail.component';
//import { EditUserComponent } from './Components/edit-user/edit-user.component';
//import { BootstrapDialogComponent } from './bootstrap-dialog.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    ToastNotificationComponent,
    NavbarComponent,
    TicketDialogComponent,
    TicketlistComponent,
    TicketdetailComponent
 

  
  ],
  imports: [
    
    AdminModule,
    AdminRoutingModule,
   BrowserAnimationsModule, 
   ToastNoAnimationModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ToastrModule.forRoot() ,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        allowedDomains: ['example.com'], // Update with your domain
        disallowedRoutes: []
      }
    }),
    SocketIoModule.forRoot(config)
  ],
  providers: [AuthService,
    InactivityTimerService,
    AuthInterceptor,
    JwtHelperService ,// Ensure JwtHelperService is provided],
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
