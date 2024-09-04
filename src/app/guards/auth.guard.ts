import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }
//working before admin 
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
 
  
  // canActivate(): boolean {
  //   if (this.authService.isLoggedIn()) {
  //     const userRole = this.authService.getUserRole();
  //     if (userRole === 'admin') {
  //       this.router.navigate(['/admin']);
  //     } else {
  //       this.router.navigate(['/dashboard']);
  //     }
  //     return true;
  //   } else {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  // }
 
}

