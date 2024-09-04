// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-edit-user',
// //   templateUrl: './edit-user.component.html',
// //   styleUrl: './edit-user.component.css'
// // })
// // export class EditUserComponent {

// // }
// // edit-user.component.ts
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { FormBuilder, FormGroup } from '@angular/forms';

// @Component({
//   selector: 'app-edit-user',
//   templateUrl: './edit-user.component.html'
// })
// export class EditUserComponent implements OnInit {
//   // user: any = {};

//   // constructor(
//   //   private route: ActivatedRoute,
//   //   private authService: AuthService,
//   //   private router: Router
//   // ) {}

//   // ngOnInit(): void {
//   //   const userId = this.route.snapshot.params['id'];
//   //   this.authService.getUserById(userId).subscribe(user => {
//   //     this.user = user;
//   //   });
//   // }

//   // updateUser(): void {
//   //   this.authService.updateUser(this.user).subscribe(() => {
//   //     console.log('update')
//   //     this.router.navigate(['/dashboard']);
//   //   });
//   // }
//   user: any = {};
//   originalUser: any = {};
//   userId!: any;
//   userForm!: FormGroup;
//   constructor(
//     private route: ActivatedRoute,
//     private authService: AuthService,
//     private router: Router,
//     private formBuilder:FormBuilder
//   ) {}


//   ngOnInit(): void {
//     this.userId = this.route.snapshot.paramMap.get('id');
//     if (this.userId) {
//       this.authService.getUserById(this.userId).subscribe(
//         (user) => {
//           this.user = user;
//         },
//         (error) => {
//           console.error('Error fetching user details:', error);
//         }
//       );
//     }
//   }

//   updateUser(): void {
//     // Include email and password in the update payload
//     const updateUser = {
//       email: this.user.email,
//       password: this.user.password,  // Keep the existing password
//       fatherName: this.user.fatherName,
//       dob: this.user.dob,
//       city: this.user.city,
//       motherName: this.user.motherName,
//       maritalStatus: this.user.maritalStatus,
//       id: this.user.id
//     };

//     this.authService.updateUser(updateUser).subscribe(
//       (response) => {
//         console.log('User updated successfully:', response);
//         this.router.navigate(['/dashboard']);
//       },
//       (error) => {
//         console.error('Error updating user:', error);
//       }
//     );
//   }
//   }
//   // ngOnInit(): void {
//   //   this.userId = +this.route.snapshot.paramMap.get('id');
//   //   this.userForm = this.formBuilder.group({
//   //     email: [''],
//   //     username: [''],
//   //     mobile: [''],
//   //     fatherName: [''],
//   //     motherName: [''],
//   //     dob: [''],
//   //     city: [''],
//   //     maritalStatus: ['']
//   //   });

//   //   this.authService.getUserById(this.userId).subscribe(user => {
//   //     this.userForm.patchValue(user); // Populate form with user data
//   //   });
//   // }

//   // onSubmit(): void {
//   //   this.userId = +this.route.snapshot.paramMap.get('id')!;
//   //   // Assuming you fetch user details here using authService or other service
//   //   // Example: this.authService.getUserById(this.userId).subscribe(user => this.user = user);
//   // }

//   // updateUser(): void {
//   //   // Assuming update logic here; adjust as per your actual implementation
//   //   this.authService.updateUser(this.userId, { ...this.user }).subscribe(
//   //     (response) => {
//   //       console.log('User updated successfully', response);
//   //       // Handle success as needed
//   //     },
//   //     (error) => {
//   //       console.error('Error updating user', error);
//   //       // Handle error as needed
//   //     }
//   //   );
//   // }

