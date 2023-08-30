import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApprovalValueSetupComponent} from './approval-value-setup/approval-value-setup.component';


const routes: Routes = [
    {path: 'approvalValueSetup', component: ApprovalValueSetupComponent},
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApprovalValueSetupRouting {
}
