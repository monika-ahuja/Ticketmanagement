// import { Component, ViewChild } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// //import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 

import { ParseSourceFile } from "@angular/compiler"

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
// export class RegisterComponent {
//   username='';
//   email = '';
//   password = '';
//   error = '';
//   formSubmitted = false; 
//   showToast = false;
  
//  // @ViewChild('toastModal') toastModal: any; // ViewChild for toast modal

//   constructor(private authService: AuthService,
//     private toastr: ToastrService ,

//     private router:Router
//     //private modalService: NgbModal
//   ) { }

//   register(): void {
//     // this.formSubmitted = true;
//      console.log('reg',this.email, this.password)
  
     
//     if (this.username && this.email && this.password) {
//       if (!this.isValidEmail(this.email)) {
//         this.error = 'Please enter a valid email address.';
//         return;
//       }
//     this.authService.register(this.username,this.email, this.password)
//       .subscribe(
//         (response:any) => {
//           this.toastr.success('User registered successfully!', 'Registration Success');
//           console.log('signinres',response);
//           // Show toast
//           this.showToast = true;
//          //this.modalService.open(this.toastModal, { centered: true });
//          this.username='';
//          this.email = '';
//          this.password = '';
//          this.error = '';
//          this.formSubmitted = false;
//           console.log('Registration successful');
//           console.log('toke',response.accessToken)
//             this.router.navigateByUrl('/login');
       
//             // Hide toast after 3 seconds
//              setTimeout(() => {
//                this.showToast = false;
//              }, 3000);
//            },
        
//         (error: any) => {
//           if (error || error.error || error.error.error === 'Email already exists') {
//             this.error = 'Email already exists. Please use a different email.';
//           } else {
//             this.error = 'Registration failed. Please try again.';
//           }
//           console.error('Registration error:', error);
//         }
//       );
//   } else {
//     this.error = 'Please provide username, email, and password.';
//   }
// }

// isValidEmail(email: string): boolean {
//   // Basic email format validation using regex
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailRegex.test(email);
// }
//  hideToast(): void {
//    this.showToast = false;
//  }


 
// isFieldInvalid(fieldName: string): boolean {
//   if (!this.formSubmitted) {
//     return false; 
//   }

//     switch (fieldName) {
//       case 'username':
//         return !this.username;
//       case 'email':
//         return !this.email;
//       case 'password':
//         return !this.password;
//       default:
//         return false;
// }

// // onEmailFieldFocus(): void {
// //   this.error = ''; // Clear error message when email field is focused
// }
// }



// ------

// password
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import * as bcrypt from 'bcryptjs'; // Import bcryptjs
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
// export class RegisterComponent {
//   registerForm: FormGroup;
//   error = '';
//   formSubmitted = false;
//   username='';
//   password='';
//   email='';

//   constructor(
//     private authService: AuthService,
//     private toastr: ToastrService,
//     private router: Router,
//     private fb: FormBuilder
//   ) {
//     this.registerForm = this.fb.group({
//       username: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: [
//         '',
//         [
//           Validators.required,
//           Validators.maxLength(7),
//           Validators.pattern(
//           //  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\d])[a-zA-Z\d!@#$%^&*()_+]{7}$/
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{7}$/

//           )
//         ]
//       ]
//     });
//   }

//   register(): void {
//     this.formSubmitted = true;

//     if (this.registerForm.valid) {
//       const { username, email, password } = this.registerForm.value;

//       this.authService.register(username, email, password).subscribe(
//         (response: any) => {
//           this.toastr.success('User registered successfully!', 'Registration Success');

//           this.router.navigateByUrl('/login');
//           this.registerForm.reset();
//           this.formSubmitted = false;

//         },
//         (error: any) => {
//           if (error && error.error || error.error.error === 'Email already exists') {
//             this.error = 'Email already exists. Please use a different email.';
//           } else {
//             this.error = 'Registration failed. Please try again.';
//           }
//           console.error('Registration error:', error);
//         }
//       );
//     } else {
//       this.error = 'Please provide valid username, email, and password.';
//     }
//   }

//   isFieldInvalid(fieldName: string): boolean {
//     const formControl = this.registerForm.get(fieldName);
//     return !!formControl && formControl.invalid && (formControl.dirty || formControl.touched);
//   }

//   isValidEmail(email: string): boolean {
//   // Basic email format validation using regex
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailRegex.test(email);
// }
// }

export class RegisterComponent {
  registerForm: FormGroup;
  error = '';
  formSubmitted = false;
  username='';
  password='';
  email='';
  isAdminVisible = false;  // Control visibility based on the requirement


  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.pattern(
          //  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\d])[a-zA-Z\d!@#$%^&*()_+]{7}$/
            // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{12}$/
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{12,}$/
          

          )
        ]
      ],
      mobile: [
        '',
        [
          Validators.maxLength(10),
          Validators.required,
          Validators.pattern(/^\d{10}$/)
        ]
      ],
      role: ['user', Validators.required] ,// Default role is 'user',
      isactive:[false]
    });
  }
//register the user
  register(): void {
    this.formSubmitted = true;

    if (this.registerForm.valid) {
      const { username, email, password,mobile,role } = this.registerForm.value;

      this.authService.register(username, email, password,mobile,role).subscribe(
        (response: any) => {
         // console.log('register response',response)
          this.toastr.success('User registered successfully!', 'Registration Success');

          this.router.navigateByUrl('/login');
          this.registerForm.reset();
          this.formSubmitted = false;

        },
        (error: any) => {
          if (error && error.error || error.error.error === 'Email already exists') {
            this.error = 'Email already exists. Please use a different email.';
          } else {
            this.error = 'Registration failed. Please try again.';
          }
          console.error('Registration error:', error);
        }
      );
    } else {
      this.error = 'Please provide valid username, email, password and mobile number.';
    }
  }

  //pss hash code
  // async register(): Promise<void> {
  //   this.formSubmitted = true;

  //   if (this.registerForm.valid) {
  //     const { username, email, password, mobile, role } = this.registerForm.value;

  //     try {
  //       const salt = await bcrypt.genSalt(10);
  //       const hashedPassword = await bcrypt.hash(password, salt);

  //       this.authService.register(username, email, hashedPassword, mobile, role).subscribe(
  //         (response: any) => {
  //           this.toastr.success('User registered successfully!', 'Registration Success');
  //           this.router.navigateByUrl('/login');
  //           this.registerForm.reset();
  //           this.formSubmitted = false;
  //         },
  //         (error: any) => {
  //           if (error && error.error && error.error.error === 'Email already exists') {
  //             this.error = 'Email already exists. Please use a different email.';
  //           } else {
  //             this.error = 'Registration failed. Please try again.';
  //           }
  //           console.error('Registration error:', error);
  //         }
  //       );
  //     } catch (error) {
  //       this.error = 'An error occurred while hashing the password. Please try again.';
  //       console.error('Hashing error:', error);
  //     }
  //   } else {
  //     this.error = 'Please provide a valid username, email, password, and mobile number.';
  //   }
  // }


  isFieldInvalid(fieldName: string): boolean {
    const formControl = this.registerForm.get(fieldName);
    return !!formControl && formControl.invalid && (formControl.dirty || formControl.touched);
  }

  isValidEmail(email: string): boolean {
  // Basic email format validation using regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
}
