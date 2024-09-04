import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuditLogService } from 'src/app/services/audit-log.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.css'
})
export class AuditLogsComponent {

  auditLogs: any;
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private auditLogService: AuditLogService,
    private location: Location,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadAuditLogs();
   
   // this.loadAuditLogs();
  }

  // loadAuditLogs() {
  //   this.auditLogService.getAuditLogs()
  //     .subscribe((logs:any) => {
  //       this.auditLogs = logs;
  //     });
  // }
  loadAuditLogs() {
    this.auditLogService.getAuditLogs().subscribe(
      (logs: any[]) => {
        this.auditLogs = logs.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
      },
      (error:any) => {
        console.error('Error loading audit logs', error);
        // Handle error
      }
    );
  }
  goBack(): void {
    this.location.back();
  }
}
