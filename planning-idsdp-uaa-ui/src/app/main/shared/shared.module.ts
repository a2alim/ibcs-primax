import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SubmitConfirmationDialogComponent } from './components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const AllMaterialModule = [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDatepickerModule,
    NativeDateModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        AllMaterialModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        AllMaterialModule
    ],
    declarations: [
      SubmitConfirmationDialogComponent
    ]
})
export class SharedModule {
}
