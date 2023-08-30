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
import { AuthSignInComponent } from 'app/main/modules/auth/features/sign-in/sign-in.component';
import { authSignInRoutes } from 'app/main/modules/auth/features/sign-in/sign-in.routing';
import { SharedModule } from '../../../../shared/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";
import { researcherListRoutes } from './researcher-list-public.routing';
import { ResearcherListPublicComponent } from './researcher-list-public.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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
    MatRadioModule,
    MatDialogModule,
    MatAutocompleteModule

];

@NgModule({
    declarations: [
        ResearcherListPublicComponent
    ],
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
        MatGridListModule,
        RouterModule.forChild(researcherListRoutes),

    ]
})
export class ResearcherListPublicModule {
}
