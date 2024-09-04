import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AuditLog {
  timestamp: Date;
  action: string;
 // user: string;
  userId: string; 
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private apiUrl = 'http://localhost:3000/auditLogs';

  constructor(private http: HttpClient) { }
//logggeed in

  logAction(action: string, userId: string): Observable<any> {
    const log: AuditLog = { timestamp: new Date(), action, userId };
    return this.http.post<any>(this.apiUrl, log);
  }

//deleteuser 
  logDeleteUserAction(userId: string): Observable<any> {
    const log: AuditLog = {
      timestamp: new Date(),
      action: `Deleted user with ID ${userId}`,
      userId: userId
    };
    return this.http.post<any>(this.apiUrl, log);
  }
  //getauditlogs
  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(this.apiUrl);
  }
}
