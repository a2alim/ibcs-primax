import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {AuthGuard} from '../../core/auth/guards/auth.guard';
import { TestReportComponent } from './features/test-report/test-report/test-report.component';
import {TestReportModule} from "./features/test-report/test-report.module";



@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        TranslateModule,
        TestReportModule,
        TranslateModule.forRoot(),
    ], providers: [AuthGuard]
})
export class ReportsManagementModule {

}
