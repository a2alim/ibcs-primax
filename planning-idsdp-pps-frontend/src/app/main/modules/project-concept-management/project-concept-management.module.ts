import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';

import {ProjectConceptModule} from './features/project-concepts/project-concept.module';
import {AuthGuard} from '../../core/auth/guards/auth.guard';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
    declarations: [],
    imports: [
        SharedModule,
        ProjectConceptModule,
    ],
    providers: [
        AuthGuard
    ]
})
export class ProjectConceptManagementModule {

}
