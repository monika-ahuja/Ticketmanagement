import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-ticket-dialog',
  templateUrl: './ticket-dialog.component.html',
  styleUrl: './ticket-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketDialogComponent {

  ticketForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TicketDialogComponent>,
    private ticketService: TicketService,
    private toastr:ToastrService,
    private cdr: ChangeDetectorRef,  // Inject ChangeDetectorRef
   
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Open']  // Set default status to 'Open'
    });
    console.log('Dialog data:', this.data);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();  // Trigger change detection after view initialization
  }

  // onSubmit(): void {
  //   if (this.ticketForm.valid) {
  //     const ticketData = { ...this.ticketForm.value };
  //     if (this.data && this.data.userId) {
  //       ticketData.userId = this.data.userId;
  //     } else {
  //       console.error('User ID is missing');
  //       return;
  //     }
  //     console.log('ticketdata',ticketData)
  //     this.ticketService.createTicket(ticketData).subscribe(
  //       (response: any) => {
  //         console.log('Ticket created successfully', response);
  //         this.toastr.success('Ticket ceated successful!', '');
  //         this.dialogRef.close(true);
  //       },
  //       (error: any) => {
  //         console.error('Error creating ticket', error);
  //       }
  //     );
  //   }
  // }
  // onClose(): void {
  //   console.log('close is click')
  //   //this.dialogRef.close(false);
  // }
  onSubmit(): void {
    if (this.ticketForm.valid) {
      const ticketData = { ...this.ticketForm.value };
      if (this.data && this.data.userId) {
        ticketData.userId = this.data.userId;
        ticketData.username = this.data.username; // Add the username to the ticket data
      } else {
        console.error('User ID is missing');
        return;
      }
      console.log('ticketData', ticketData);
      this.ticketService.createTicket(ticketData).subscribe(
        (response: any) => {
          console.log('Ticket created successfully', response);
          this.toastr.success('Ticket created successfully!', '');
          this.dialogRef.close(true);
        },
        (error: any) => {
          console.error('Error creating ticket', error);
          this.toastr.error('Error creating ticket', '');
        }
      );
    }
  }

  onClose(): void {
    console.log('Close button clicked, dialog will be closed without saving');
    this.dialogRef.close(false); // Close the dialog without saving
  }
}