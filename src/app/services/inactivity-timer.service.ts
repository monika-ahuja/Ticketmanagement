import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InactivityTimerService {
  private userActivity$: Observable<any>;
  private lastActivityTime!: number;
  public inactivityThresholdMs = 10*60 * 1000; // 5 minute
  private inactivityTimeoutId: any;
  public inactivityTimeoutExpired$: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService) {
    this.userActivity$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keypress'),
      fromEvent(document, 'scroll')
    );

    this.userActivity$.subscribe(() => this.resetInactivityTimer());
  }

  private resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimeoutId);
    this.lastActivityTime = Date.now();
    this.inactivityTimeoutId = setTimeout(() => {
      const currentTime = Date.now();
      if (currentTime - this.lastActivityTime >= this.inactivityThresholdMs) {
        this.authService.clearAuthToken();
        this.inactivityTimeoutExpired$.next();
      }
    }, this.inactivityThresholdMs);
  }

  public startInactivityTracking(): void {
    this.resetInactivityTimer();
  }

  public stopInactivityTracking(): void {
    clearTimeout(this.inactivityTimeoutId);
  }

  public getTimeSinceLastActivity(): number {
    return Date.now() - this.lastActivityTime;
  }
}
