import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { UsersComponent } from '../admin/users/users.component';
import { AuditLogsComponent } from '../admin/audit-logs/audit-logs.component';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatOptionModule } from '@angular/material/core';
import { TicketsComponent } from '../admin/tickets/tickets.component';
import { TicketComponent } from '../admin/ticket/ticket.component';
import { TicketdetailsComponent } from '../admin/ticketdetails/ticketdetails.component';
//import { TicketDetailComponent } from '../admin/ticket-detail/ticket-detail.component';
// import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [AdminDashboardComponent,
    UsersComponent,
    AuditLogsComponent,
    TimeAgoPipe,
    TicketComponent,
    TicketsComponent,
    TicketdetailsComponent
   // TicketDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule,
    NgxPaginationModule,
    MatOptionModule,
   // NgChartsModule,
    // MatOptionSelectionChange
  ]
})
export class AdminModule { }
