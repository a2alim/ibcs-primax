import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FuseCardModule} from '@fuse/components/card';
import {FuseAlertModule} from '@fuse/components/alert';

import {AuthUnlockSessionComponent} from 'app/main/modules/auth/features/unlock-session/unlock-session.component';
import {authUnlockSessionRoutes} from 'app/main/modules/auth/features/unlock-session/unlock-session.routing';
import {SharedModule} from '../../../../shared/shared.module';

@NgModule({
    declarations: [
        AuthUnlockSessionComponent
    ],
    imports     : [
        RouterModule.forChild(authUnlockSessionRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule
    ]
})
export class AuthUnlockSessionModule
{
}
