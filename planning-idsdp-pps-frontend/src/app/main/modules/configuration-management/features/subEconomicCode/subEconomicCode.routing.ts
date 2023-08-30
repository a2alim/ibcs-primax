import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SubEconomicCodeComponent} from './sub-economic-code/sub-economic-code.component';


const routes: Routes = [
    {path: 'subEconomicCode', component: SubEconomicCodeComponent},
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubEconomicCodeRouting {
}
