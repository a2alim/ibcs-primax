import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatStepperModule } from "@angular/material/stepper";
import { TranslateModule } from "@ngx-translate/core";
import { MatIconModule } from "@angular/material/icon";

import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FuseCardModule } from '@fuse/components/card';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/main/shared/shared.module';

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
  MatRadioModule

];

@NgModule({
  declarations: [],
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
  ]
})
export class MatModules {
}
