import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './Components/register/register.component';
import { TicketlistComponent } from './Components/ticketlist/ticketlist.component';
import { TicketdetailComponent } from './Components/ticketdetail/ticketdetail.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login page by default
  { path: 'login', component: LoginComponent  },
  {path:'register',component:RegisterComponent},
  { path: 'dashboard', component: DashboardComponent ,canActivate: [AuthGuard]  },
  { path: 'ticket-list', component: TicketlistComponent ,canActivate: [AuthGuard]},
  { path: 'ticket-list/:id', component: TicketdetailComponent,canActivate: [AuthGuard] },
 { path: 'home', loadChildren: () => import('./admin/admin-dashboard/admin.module').then(m => m.AdminModule)}


];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
