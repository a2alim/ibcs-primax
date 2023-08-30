import {Route} from '@angular/router';
import { EligibilityCheckerComponent } from './eligibility-checker/eligibility-checker.component';
import { RmsLoginComponent } from './rms-login/rms-login.component';
import { RmsSignUpComponent } from './rms-sign-up/rms-sign-up.component';
import {UserVerificationComponent} from './user-verification/user-verification.component';
import {TiUserVerificationComponent} from '../rms-ti/ti-user-verification/ti-user-verification.component';


export const rmsRoutes: Route[] = [
    {
        path     : 'researcher/sign-up',
        component: RmsSignUpComponent
    },
    {
        path     : 'researcher/sign-in',
        component: RmsLoginComponent
    },
    {
        path     : 'eligibility-checker/add',
        component: EligibilityCheckerComponent
    },

    {
        path     : 'account-verification/:userId',
        component: UserVerificationComponent
    },
    {
        path     : 'account-verification/:userId/ti',
        component: TiUserVerificationComponent
    }   
    
];
