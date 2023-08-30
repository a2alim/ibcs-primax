import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {FuseCardModule} from '@fuse/components/card';
import {AuthSignOutComponent} from 'app/main/modules/auth/features/sign-out/sign-out.component';
import {authSignOutRoutes} from 'app/main/modules/auth/features/sign-out/sign-out.routing';
import {SharedModule} from '../../../../shared/shared.module';

@NgModule({
    declarations: [
        AuthSignOutComponent
    ],
    imports     : [
        RouterModule.forChild(authSignOutRoutes),
        MatButtonModule,
        FuseCardModule,
        SharedModule
    ]
})
export class AuthSignOutModule
{
}
