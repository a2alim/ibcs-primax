import {Route} from '@angular/router';
import {AuthForgotPasswordComponent} from 'app/main/modules/auth/features/forgot-password/forgot-password.component';

export const authForgotPasswordRoutes: Route[] = [
    {
        path     : '',
        component: AuthForgotPasswordComponent
    }
];
