import {Route} from '@angular/router';
import {AuthSignUpComponent} from 'app/main/modules/auth/features/sign-up/sign-up.component';

export const authSignupRoutes: Route[] = [
    {
        path     : '',
        component: AuthSignUpComponent
    }
];
