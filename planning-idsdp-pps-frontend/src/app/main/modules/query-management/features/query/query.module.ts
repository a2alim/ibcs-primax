import {MatPaginatorModule} from '@angular/material/paginator';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {RouterModule} from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatChipsModule} from '@angular/material/chips';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FuseCardModule} from '@fuse/components/card';
import {CKEditorModule} from 'ng2-ckeditor';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {QueryCreateComponent} from './query-create/query-create.component';
import {QueryListComponent} from './query-list/query-list.component';
import {QueryRouting} from './query.routing';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {SharedModule} from "../../../../shared/shared.module";

@NgModule({
    declarations: [
        QueryListComponent,
        QueryCreateComponent
    ],
    imports: [
        SharedModule,
        QueryRouting,
        MaterialFileInputModule,
    ]
})
export class QueryModule {

}
