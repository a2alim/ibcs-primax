import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AttachmentUploadComponent} from './components/attachment-upload/attachment-upload.component';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ProjectLocationCommonComponent} from './components/project-location-common/project-location-common.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {SubmitConfirmationDialogComponent} from './components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectSearchComponent} from './components/mat-select-search/mat-select-search.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SendToDakComponent} from './components/send-to-dak/send-to-dak.component';
import {CKEditorModule} from 'ng2-ckeditor';
import {TwoDigitDecimalNumberDirective} from './directives/two-digit-decimal-number.directive';
import {NumberDirective} from './directives/numbers-only.directive';
import {MonthNamePipe} from './pipes/month-name.pipe';
import {NumberPipe} from './pipes/number-pipe.pipe';
import {DateBengaliPipe} from './pipes/date-bengali-pipe';
import { ErrorRoutingModule } from './components/error/error-routing.module';
import { RouterModule } from '@angular/router';
import { ForbiddenComponent } from './components/error/forbidden/forbidden.component';
import { DeskUserMovementComponent } from './components/desk-user-movement/desk-user-movement.component';
import { MatRadioModule } from '@angular/material/radio';
import { CommonLoaderSpinnerComponent } from './components/common-loader-spinner/common-loader-spinner.component';
import { PotroJariComponent } from './components/potro-jari/potro-jari.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { SendToDakEnothiComponent } from './components/send-to-dak-enothi/send-to-dak-enothi.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatTabsModule} from "@angular/material/tabs";
import {MatChipsModule} from "@angular/material/chips";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDividerModule} from "@angular/material/divider";
import {NgxBootstrapConfirmModule} from "ngx-bootstrap-confirm";
import {FuseDrawerModule} from "../../../@fuse/components/drawer";
import {NgApexchartsModule} from "ng-apexcharts";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {GoogleChartsModule} from "angular-google-charts";
import {FuseCardModule} from "../../../@fuse/components/card";
import {ModalModule} from "ngx-bootstrap/modal";
import {A11yModule} from "@angular/cdk/a11y";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTimepickerModule} from "mat-timepicker";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {DragDropModule} from "@angular/cdk/drag-drop";
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSortModule } from '@angular/material/sort';
import { ListHeaderComponent } from './components/list-header/list-header.component';
import { ProjectSummariesComponent } from './components/project-summaries/project-summaries.component';
import {NumberRangeDirective} from "./directives/number-range.directive";
import { MisReportComponent } from './components/mis-report/mis-report.component';
import {MAT_DATE_LOCALE} from "@angular/material/core";
import { GroupBy } from './pipes/group-by.pipe';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';

const _materialModule = [
    NgxMatSelectSearchModule,
    ErrorRoutingModule,
    DragDropModule,
    FuseCardModule,
    ModalModule.forRoot(),
    A11yModule,
    NgxMaterialTimepickerModule,
    CommonModule,
    TranslateModule,
    RouterModule,
    NgxBootstrapConfirmModule,
    FlexLayoutModule,
    FormsModule,
    CKEditorModule,
    GoogleChartsModule,
    NgApexchartsModule,
    FuseDrawerModule,

    MatSortModule,
    MatMomentDateModule,
    MatGridListModule,
    MatTimepickerModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatRadioModule,
    MatCheckboxModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDividerModule,
    MaterialFileInputModule,
    MatTooltipModule,
];

@NgModule({
    imports: [
        _materialModule,
    ],
    exports: [
        _materialModule,
        AttachmentUploadComponent,
        ProjectLocationCommonComponent,
        MatSelectSearchComponent,
        CommonLoaderSpinnerComponent,
        TwoDigitDecimalNumberDirective,
        NumberRangeDirective,
        NumberDirective,
        NumberPipe,
        MonthNamePipe,
        DateBengaliPipe,
        ListHeaderComponent,
        GroupBy,
        DashboardHeaderComponent
    ],
    declarations: [
        AttachmentUploadComponent,
        ProjectLocationCommonComponent,
        SubmitConfirmationDialogComponent,
        MatSelectSearchComponent,
        SendToDakComponent,
        NumberPipe,
        MonthNamePipe,
        TwoDigitDecimalNumberDirective,
        NumberRangeDirective,
        NumberDirective,
        DateBengaliPipe,
        ForbiddenComponent,
        DeskUserMovementComponent,
        CommonLoaderSpinnerComponent,
        PotroJariComponent,
        SendToDakEnothiComponent,
        ListHeaderComponent,
        ProjectSummariesComponent,
        MisReportComponent,
        GroupBy,
        DashboardHeaderComponent
    ],
    providers: [
        NumberPipe,
        MonthNamePipe,
        DateBengaliPipe,
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
    ]

})
export class SharedModule {
}
