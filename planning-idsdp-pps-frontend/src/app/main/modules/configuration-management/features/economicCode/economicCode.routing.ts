import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EconomicCodeComponent} from './economic-code/economic-code.component';


const routes: Routes = [
    {path: 'economicCode', component: EconomicCodeComponent},

];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EconomicCodeRouting {
}
