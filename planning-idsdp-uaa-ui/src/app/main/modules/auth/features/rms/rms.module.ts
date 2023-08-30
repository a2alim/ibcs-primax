import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from '../../../../shared/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";
import { rmsRoutes } from './rms.routing';
import { RmsSignUpComponent } from './rms-sign-up/rms-sign-up.component';
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RmsLoginComponent } from './rms-login/rms-login.component';
import { EligibilityCheckerComponent } from './eligibility-checker/eligibility-checker.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ShowMarkModalComponent } from './eligibility-checker/show-mark-modal/show-mark-modal.component';
import {TiUserVerificationComponent} from '../rms-ti/ti-user-verification/ti-user-verification.component';
import { ShowDetailsModalComponent } from './rms-sign-up/show-details-modal/show-details-modal.component';


const AllMaterialModule = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatCardModule,
  MatSnackBarModule,
  MatButtonModule,
  MatTooltipModule,
  NativeDateModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatMomentDateModule,

];

@NgModule({
  declarations: [
    RmsSignUpComponent,
    RmsLoginComponent,
    EligibilityCheckerComponent,
    ShowMarkModalComponent,
    TiUserVerificationComponent,
    ShowDetailsModalComponent
  ],
  imports: [
    AllMaterialModule,
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FuseCardModule,
    FuseAlertModule,
    SharedModule,
    FlexLayoutModule,
    MatCardModule,
    RouterModule.forChild(rmsRoutes),
    MatSelectModule,
    MatRadioModule,
  ]
})
export class RmsModule { }
