import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, pipe, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
//import jwt_decode from 'jwt-decode'; // Import jwt_decode library
import { jwtDecode } from 'jwt-decode';
import { EncryptionDecryptionService } from './encryption-decryption.service';
import { Router } from '@angular/router';
import { AuditLogService } from './audit-log.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper: JwtHelperService = new JwtHelperService();

  private tokenKey = 'authToken';
  private baseUrl = 'http://localhost:3000';
  // http://localhost:3000/register
  private isLoggedInFlag = false;
  constructor(private http: HttpClient,
    private encryptionService: EncryptionDecryptionService,
    private route: Router,
    private auditLogService: AuditLogService,
    private toastr: ToastrService) { }


  register(username: string, email: string, password: string, mobile: string, role: string): Observable<any> {
    const url = `${this.baseUrl}/register`;
    return this.http.post<any>(url, { username, email, password, mobile, role });
  }


  //logiin
  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<any>(url, { email, password }, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          this.saveToken(response.accessToken);
          this.saveUser(response.user);
          //this.isLoggedInFlag = true; // Set the flag to indicate logged in
        }),
        catchError(this.handleError)
      );
  }

  //exception handling code
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      if (error.status === 400) {
        // Check if the error message indicates an incorrect password
        if (error.error && error.error.message && error.error.message === 'Incorrect password') {
          errorMessage = 'The password you entered is incorrect. Please try again.';
        } else {
          errorMessage = `Bad Request: ${error.error.message || 'Invalid request'}`;
        }
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }


  getUsers(): Observable<any[]> {
    const token = sessionStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.baseUrl}/users`, { headers });
  }


  getUser(): any {
    const encryptedUser = sessionStorage.getItem('currentUser');
    if (encryptedUser) {
      const decryptedUser = this.encryptionService.decryptData(encryptedUser);
      return JSON.parse(decryptedUser);
    }
    return null;
  }
  getCurrentUser(): any {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken;
    }
    return null;
  }

  getToken(): string | null {
    const encryptedToken = sessionStorage.getItem('token');
    if (encryptedToken) {
      return this.encryptionService.decryptData(encryptedToken); // Decrypt the token before returning
    }
    return null;
  }

  saveToken(token: string): void {
    const encryptedToken = this.encryptionService.encryptData(token); // Encrypt the token before saving
    sessionStorage.setItem('token', encryptedToken);
  }

  saveUser(user: any): void {
    const encryptedUser = this.encryptionService.encryptData(JSON.stringify(user));
    //sessionStorage.setItem('cure',JSON.stringify(user))
    sessionStorage.setItem('currentUser', encryptedUser);
  }



  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/${user.id}`, user);
  }


  logout(): void {
    const userId = this.getUser().id;
    //console.log('useridlogotauth',userId)
    this.auditLogService.logAction('User logged out', userId).subscribe(
      () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('isLoggeedIn');
        sessionStorage.removeItem('userRole');
        this.isLoggedInFlag = false; // Reset logged in flag
        this.route.navigate(['/login']);
      },
      (error) => {
        console.error('Error logging out:', error);

      }
    );
  }




  clearAuthToken(): void {
    sessionStorage.removeItem('token');
  }


  isAuthenticated(): boolean {
    return this.isLoggedInFlag;
  }


  // isAuthenticated(): boolean {
  //   const token = this.getToken();
  //   return !!token; // Check if token exists
  // }
  isLoggedIn(): any {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
    // return token ? !this.isTokenExpired(token) : false;
  }

  isTokenExpired(token: string): boolean {
    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Token is considered expired on error
    }
  }


  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }

  getUserRole(): string {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return user.role || '';
  }

  saveUserrole(role: string): void {
    sessionStorage.setItem('userRole', role);
  }

  // getUserrole(): string {
  //   return sessionStorage.getItem('userRole') || '';
  // }


}


