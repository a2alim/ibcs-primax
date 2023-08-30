import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ERROR, FAILED_SAVE, OK, SUCCESSFULLY_DELETED, SUCCESSFULLY_SAVE, SUCCESSFULLY_SEND} from '../constants/message';

@Injectable({
    providedIn: 'root'
})
export class SnackbarHelper {
    constructor(private snackBar: MatSnackBar) {
    }

    openSuccessSnackBar(): void {
        this.snackBar.open(SUCCESSFULLY_SAVE, OK, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
        });
    }
    openSuccessSendSnackBar(): void {
        this.snackBar.open(SUCCESSFULLY_SEND, OK, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
        });
    }

    openSuccessSnackBarWithMessage(message: string, action: string): void {
        this.snackBar.open(message, action, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
        });
    }

    openErrorSnackBar(): void {
        this.snackBar.open(FAILED_SAVE, '', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
        });
    }

    openErrorSnackBarWithMessage(message: string, action: string): void {
        this.snackBar.open(message, action, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
        });
    }
    openWarnSnackBarWithMessage(message: string, action: string): void {
        this.snackBar.open(message, action, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['warn-snackbar']
        });
    }

    deleteSuccessSnackBar(): void {
        this.snackBar.open(SUCCESSFULLY_DELETED, OK, {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
        });
    }
}
