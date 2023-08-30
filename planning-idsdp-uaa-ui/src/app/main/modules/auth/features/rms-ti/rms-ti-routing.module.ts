import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { TiSignUpComponent} from './ti-sign-up/ti-sign-up.component';
import { TiSignInComponent } from './ti-sign-in/ti-sign-in.component';
import { TiParticipantSignInComponent } from './ti-participant-sign-in/ti-participant-sign-in.component';
import {UserVerificationComponent} from '../rms/user-verification/user-verification.component';
import {TiUserVerificationComponent} from './ti-user-verification/ti-user-verification.component';

const routes: Routes = [
    {
        path: 'sign-up',
        component: TiSignUpComponent
    },
    {
        path: 'sign-in',
        component: TiSignInComponent
    },
    {
        path: 'participants/sign-in',
        component: TiParticipantSignInComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RmsTiRoutingModule {
}
