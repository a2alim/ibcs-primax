import {NgModule} from '@angular/core';
import {DevelopmentPartnerComponent} from './development-partner/development-partner.component';
import {DevelopmentPartnerRouting} from './developmentPartner-routing.module';
import {SharedModule} from "../../../../shared/shared.module";

@NgModule({
    // tslint:disable-next-line:max-line-length
    declarations: [
        DevelopmentPartnerComponent
    ],
    imports: [
        DevelopmentPartnerRouting,
        SharedModule
    ]
})
export class DevelopmentPartner {
}
