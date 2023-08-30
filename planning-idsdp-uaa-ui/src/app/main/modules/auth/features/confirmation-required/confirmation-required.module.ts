import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {FuseCardModule} from '@fuse/components/card';
import {AuthConfirmationRequiredComponent} from 'app/main/modules/auth/features/confirmation-required/confirmation-required.component';
import {authConfirmationRequiredRoutes} from 'app/main/modules/auth/features/confirmation-required/confirmation-required.routing';
import {SharedModule} from '../../../../shared/shared.module';

@NgModule({
    declarations: [
        AuthConfirmationRequiredComponent
    ],
    imports: [
        RouterModule.forChild(authConfirmationRequiredRoutes),
        MatButtonModule,
        FuseCardModule,
        SharedModule
    ]
})
export class AuthConfirmationRequiredModule {
}
