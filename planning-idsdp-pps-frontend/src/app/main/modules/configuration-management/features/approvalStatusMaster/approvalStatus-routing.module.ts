import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ApprovalStatusComponent} from './approval-status/approval-status.component';


const routes: Routes = [
    // Admin routes
    {path: 'approval', component: ApprovalStatusComponent},

];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApprovalStatusRouting {
}
