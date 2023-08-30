import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {AuthGuard} from '../../core/auth/guards/auth.guard';
import {FeasibilityStudyModule} from './feature/feasibility-study/feasibility-study.module';
import {SharedModule} from "../../shared/shared.module";



@NgModule({
    declarations: [],
    imports: [
        SharedModule,
        FeasibilityStudyModule,

    ], providers: [AuthGuard]
})
export class FeasibilityStudyManagementModule { }
