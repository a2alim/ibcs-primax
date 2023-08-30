import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../../core/auth/guards/auth.guard';
import {LayoutComponent} from '../../../../../layout/layout.component';
import {InitialDataResolver} from '../../../../../app.resolvers';
import {TestReportComponent} from "./test-report/test-report.component";



const routes: Routes = [
    // Admin routes
    {
        path: 'report-management',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {path: 'test-report', component: TestReportComponent}           
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class TestReportRouting {

}
