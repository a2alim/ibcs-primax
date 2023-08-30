import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutComponent } from 'app/layout/layout.component';
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { CenteredLayoutModule } from 'app/layout/layouts/horizontal/centered/centered.module';
import { EnterpriseLayoutModule } from 'app/layout/layouts/horizontal/enterprise/enterprise.module';
import { MaterialLayoutModule } from 'app/layout/layouts/horizontal/material/material.module';
import { ModernLayoutModule } from 'app/layout/layouts/horizontal/modern/modern.module';
import { ClassicLayoutModule } from 'app/layout/layouts/vertical/classic/classic.module';
import { ClassyLayoutModule } from 'app/layout/layouts/vertical/classy/classy.module';
import { CompactLayoutModule } from 'app/layout/layouts/vertical/compact/compact.module';
import { DenseLayoutModule } from 'app/layout/layouts/vertical/dense/dense.module';
import { FuturisticLayoutModule } from 'app/layout/layouts/vertical/futuristic/futuristic.module';
import { ThinLayoutModule } from 'app/layout/layouts/vertical/thin/thin.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { SharedModule } from '../main/shared/shared.module';
import { ChangePasswordComponent } from './common/change-password/change-password.component';


const layoutModules = [
    // Empty
    EmptyLayoutModule,

    // Horizontal navigation
    CenteredLayoutModule,
    EnterpriseLayoutModule,
    MaterialLayoutModule,
    ModernLayoutModule,

    // Vertical navigation
    ClassicLayoutModule,
    ClassyLayoutModule,
    CompactLayoutModule,
    DenseLayoutModule,
    FuturisticLayoutModule,
    ThinLayoutModule
];
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
    MatTabsModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatSortModule,
    MatRadioModule
];

@NgModule({
    declarations: [
        LayoutComponent,
        ChangePasswordComponent
    ],
    imports: [
        MatIconModule,
        MatTooltipModule,
        FuseDrawerModule,
        SharedModule,
        FuseCardModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        TranslateModule.forRoot(),
        AllMaterialModule,
        ...layoutModules
    ],
    exports: [
        LayoutComponent,
        ...layoutModules
    ]
})
export class LayoutModule {
}
