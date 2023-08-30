import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RmsTiRoutingModule } from './rms-ti-routing.module';
import { TiSignUpComponent } from './ti-sign-up/ti-sign-up.component';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatNativeDateModule, NativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FuseCardModule} from '../../../../../../@fuse/components/card';
import {FuseAlertModule} from '../../../../../../@fuse/components/alert';
import {SharedModule} from '../../../../shared/shared.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {rmsRoutes} from '../rms/rms.routing';
import {MatRadioModule} from '@angular/material/radio';
import {TiSignInComponent} from './ti-sign-in/ti-sign-in.component';
import { TiParticipantSignInComponent } from './ti-participant-sign-in/ti-participant-sign-in.component';

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
    TiSignUpComponent,
    TiSignInComponent,
    TiParticipantSignInComponent
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
      RmsTiRoutingModule
  ]
})
export class RmsTiModule { }
