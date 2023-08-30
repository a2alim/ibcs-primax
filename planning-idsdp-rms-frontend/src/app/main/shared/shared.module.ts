import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import {SubmitConfirmationDialogComponent} from './components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {TranslateModule} from "@ngx-translate/core";
import {MatSelectSearchComponent} from './components/mat-select-search/mat-select-search.component';
import {MatOptionModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import { FormHeaderComponent } from './components/form-header/form-header.component';
import { MatIconModule } from '@angular/material/icon';
import {CKEditorModule} from 'ng2-ckeditor';
import { SendToDakComponent } from './components/send-to-dak/send-to-dak.component';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OtpComponent } from './components/otp/otp.component';

const _materialModule = [
    MatButtonModule,
    MatDialogModule,
    MatInputModule
];

@NgModule({
    declarations: [ConfirmDialogComponent, SubmitConfirmationDialogComponent, MatSelectSearchComponent, FormHeaderComponent, SendToDakComponent, OtpComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        _materialModule,
        TranslateModule,
        MatOptionModule,
        MatFormFieldModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        MatIconModule,
        CKEditorModule,
        FlexLayoutModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectSearchComponent,
        FormHeaderComponent
    ]
})
export class SharedModule {
}
