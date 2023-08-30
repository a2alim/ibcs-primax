import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'app/main/core/auth/guards/auth.guard';
import {SsoComponent} from './sso.component';

const routes: Routes = [
    // SSO routes
    {
        path: 'sso-landing',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: SsoComponent
        // resolve: {
        //     initialData: InitialDataResolver,
        // },
        // children: [
        //     {path: 'sso-landing', component: SsoComponent},
        // ]
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: []
})
export class SsoRouting {
}
