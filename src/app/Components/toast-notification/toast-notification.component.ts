import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast-notification',
  //standalone: true,
  //imports: [],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.css'
})
export class ToastNotificationComponent {

  @Input() showToast: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Automatically hide the toast after 3 seconds
    // if (this.showToast) {
    //   setTimeout(() => {
    //     this.hideToast();
    //   }, 3000);
    // }
  }

  hideToast(): void {
    this.showToast = false;
  }
}
