import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from '../services/alert.service';

describe('AlertService', () => {
  let service: AlertService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        AlertService,
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });

    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show a success message', () => {
    // Arrange
    const message = 'Operation successful';

    // Act
    service.success(message);

    // Assert
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      message,
      'Close',
      jasmine.objectContaining({
        duration: 5000,
        panelClass: 'success',
        horizontalPosition: 'end',
        verticalPosition: 'top',
      })
    );
  });

  it('should show an error message', () => {
    // Arrange
    const message = 'An error occurred';

    // Act
    service.error(message);

    // Assert
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      message,
      'Close',
      jasmine.objectContaining({
        duration: 5000,
        panelClass: 'error',
        horizontalPosition: 'end',
        verticalPosition: 'top',
      })
    );
  });
});
