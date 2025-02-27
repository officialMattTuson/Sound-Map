import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private readonly snackbar: MatSnackBar) {}

  success(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'success',
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  error(message: string): void {
    console.log(message)
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'error',
      verticalPosition: 'top',
      horizontalPosition: 'end', 
    });
  }
}
