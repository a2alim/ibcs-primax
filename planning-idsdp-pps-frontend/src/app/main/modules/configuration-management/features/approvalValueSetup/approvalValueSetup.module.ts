import {NgModule} from '@angular/core';
import {ApprovalValueSetupComponent} from './approval-value-setup/approval-value-setup.component';
import {ApprovalValueSetupRouting} from './approvalValueSetup.routing';
import {SharedModule} from "../../../../shared/shared.module";


@NgModule({
    // tslint:disable-next-line:max-line-length
    declarations: [
        ApprovalValueSetupComponent
  ],
    imports: [
        ApprovalValueSetupRouting,
        SharedModule,


    ]
})
export class ApprovalValueSetupModule {
}
