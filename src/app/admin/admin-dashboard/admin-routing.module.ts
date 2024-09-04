import { NgModule, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { UsersComponent } from '../admin/users/users.component';
import { AuditLogsComponent } from '../admin/audit-logs/audit-logs.component';
import { AuthGuard } from '../../guards/auth.guard';
import { TicketsComponent } from '../admin/tickets/tickets.component';
import { TicketComponent } from '../admin/ticket/ticket.component';
import { TicketdetailsComponent } from '../admin/ticketdetails/ticketdetails.component';


const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'users', component: UsersComponent },
      //{ path: 'tickets/:userId', component: TicketComponent },
      { path: 'audit-logs', component: AuditLogsComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'home/tickets/:userId', component: TicketComponent },
  { path: 'home/tickets/ticket-details/:ticketId', component: TicketdetailsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
