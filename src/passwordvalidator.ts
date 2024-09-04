// import { AbstractControl, ValidatorFn } from '@angular/forms';

// export function passwordValidator(): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     const value: string = control.value;

//     if (!value) {
//       return { required: true }; // Return required error if value is empty
//     }

//     // Validate password criteria
//     const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\d])[a-zA-Z\d!@#$%^&*()_+]{1,7}$/;

//     if (!passwordRegex.test(value)) {
//       return { invalidPassword: true };
//     }

//     return null; // Return null if validation passes
//   };
// }
