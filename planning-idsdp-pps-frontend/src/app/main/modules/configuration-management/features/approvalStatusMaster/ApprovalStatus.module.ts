import {NgModule} from '@angular/core';
import {ApprovalStatusComponent} from './approval-status/approval-status.component';
import {ApprovalStatusRouting} from './approvalStatus-routing.module';
import {SharedModule} from "../../../../shared/shared.module";


@NgModule({
    // tslint:disable-next-line:max-line-length
    declarations: [
        ApprovalStatusComponent
    ],
    imports: [
        ApprovalStatusRouting,
        SharedModule
    ]
})
export class ApprovalStatus {
}
