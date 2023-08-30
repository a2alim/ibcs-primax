import {NgModule} from '@angular/core';

import {AuthGuard} from '../../core/auth/guards/auth.guard';
import {DppTappListModule} from './features/dpp-tapp-list/dpp-tapp-list.module';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
    declarations: [],
    imports: [
        SharedModule,
        DppTappListModule,
    ], providers: [AuthGuard]
})
export class RdppRtappManagementModule {

}
