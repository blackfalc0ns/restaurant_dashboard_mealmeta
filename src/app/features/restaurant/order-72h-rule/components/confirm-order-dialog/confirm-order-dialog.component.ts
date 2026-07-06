import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'mm-confirm-order-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './confirm-order-dialog.component.html',
  styleUrl: './confirm-order-dialog.component.scss',
})
export class ConfirmOrderDialogComponent {}
