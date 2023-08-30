import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { TranslateModule } from "@ngx-translate/core";
import { NgApexchartsModule } from "ng-apexcharts";
import { CKEditorModule } from 'ng2-ckeditor';
import { MaterialFileInputModule } from "ngx-material-file-input";
import { NgxPrintModule } from 'ngx-print';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from "../../shared/shared.module";
import { ResearcherAgreementListComponent } from './features/e-Nothi-approval-process/researcher-agreement/researcher-agreement-list/researcher-agreement-list.component';
import { SafeHtmlPipe } from "./pipes/SafeHtmlPipe";
import { CustomCapitalizePipe } from './pipes/Validations/custom-capitalize.pipe';
import { EmailValidatorPipe } from "./pipes/Validations/EmailValidatorPipe";
import { EmptyFieldValidatorPipe } from "./pipes/Validations/EmptyFieldValidatorPipe";
import { NidValidatorPipe } from "./pipes/Validations/NidValidatorPipe";
import { PhoneNumberValidatorPipe } from "./pipes/Validations/PhoneNumberValidatorPipe";
import { ResultFinderPipe } from "./pipes/Validations/ResultFinderPipe";
import { RpmRoutingModule } from './rpm-routing.module';

const AllMaterialModule = [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule,
    MatSnackBarModule,
    NativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    CKEditorModule,
    MaterialFileInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatStepperModule,
    MatTableModule,
    MatDatepickerModule,
    MatTabsModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatSortModule,
    MatTooltipModule,
    MatRadioModule,
    MatDialogModule,
    MatAutocompleteModule

];

@NgModule({
    declarations: [
        ResearcherAgreementListComponent
    ],
    providers: [EmptyFieldValidatorPipe, EmailValidatorPipe,
        NidValidatorPipe, PhoneNumberValidatorPipe,ResultFinderPipe,
        SafeHtmlPipe],
    exports: [EmptyFieldValidatorPipe, EmailValidatorPipe,ResultFinderPipe,
        NidValidatorPipe, PhoneNumberValidatorPipe,
        SafeHtmlPipe, CustomCapitalizePipe],
    imports: [
        CommonModule,
        HttpClientModule,
        TranslateModule,
        TranslateModule.forRoot(),
        FuseCardModule,
        FlexLayoutModule,
        AllMaterialModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        DragDropModule,
        SharedModule,
        RpmRoutingModule,
        ToastrModule.forRoot(),
        MatGridListModule,
        NgApexchartsModule,
        NgxPrintModule

    ]
})
export class MatModules {
}
