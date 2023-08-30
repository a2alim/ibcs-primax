import {NgModule} from '@angular/core';
import {EconomicCodeRouting} from './economicCode.routing';
import {EconomicCodeComponent} from './economic-code/economic-code.component';
import {SharedModule} from "../../../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
    // tslint:disable-next-line:max-line-length
    declarations: [
        EconomicCodeComponent
    ],
    imports: [
        EconomicCodeRouting,
        SharedModule
    ]
})
export class EconomicCodeModule {
}
