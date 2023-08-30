import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DevelopmentPartnerComponent} from './development-partner/development-partner.component';


const routes: Routes = [
    {path: 'development', component: DevelopmentPartnerComponent},
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DevelopmentPartnerRouting {
}
