import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EncryptionDecryptionService } from '../../services/encryption-decryption.service';
import { AuditLogService } from 'src/app/services/audit-log.service';
import * as bcrypt from 'bcryptjs'; // Import bcryptjs
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  //REACTIVE FORMS FOR PREVENT SQL INJECTION ATTACKS  
  email = '';
  password = '';
  loginForm: FormGroup;
  error: string = '';
  formSubmitted: boolean = false;
  showToast = false;
  ID: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private encryptionService: EncryptionDecryptionService,
    private auditLogService: AuditLogService
  ) {
    //sanitize input data approaches for validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });


  }


  login(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.login(email, password).subscribe(
        (response: any) => {

          console.log('Login successful:', response);

          this.authService.saveToken(response.accessToken);
          this.authService.saveUser(response.user);
          this.authService.saveUserrole(response.user.role);
          if (this.authService.isLoggedIn()) {
            this.toastr.success('Login successful!', '');
            this.email = '',
              this.password = ''
            const userRole = response.user.role;
            //console.log('userrole', response.user.role, userRole)
            const userId = response.user.id;
            this.ID = response.user.id;
            //console.log('userID',  this.ID)
            this.auditLogService.logAction('User logged in', userId).subscribe();
            if (userRole === 'admin') {
              // console.log('Navigating to admin page');
              this.router.navigateByUrl('/home');
            } else if (userRole === 'user') {
              // console.log('Navigating to dashboard page');
              this.router.navigateByUrl('/dashboard');
            } else {
              this.toastr.error('Invalid user role', 'Error');
            }
          }

          else {
            this.toastr.error('Invalid token or token expired');
          }
        },
        (error: any) => {
          if (error.status === 400 && error.error === 'Incorrect password') {
            this.toastr.error('Incorrect password. Please try again.', 'Login failed');
          } else if (error.status === 400 && error.error === 'User not found') {
            this.toastr.error('User with this email does not exist.', 'Login failed');
          } else {
            this.toastr.error('Check credentials. Please try again later.', '');
          }
          (error: any) => {
            //this.handleLoginError(error);
          }
        });
    } else {
      this.toastr.error('Please provide valid email and password.', '');
    }
  }

  hideToast(): void {
    this.showToast = false;
  }


  isFieldInvalid(fieldName: string): boolean {
    const formControl = this.loginForm.get(fieldName);
    return !!formControl && formControl.invalid && (formControl.dirty || formControl.touched);
  }
}
