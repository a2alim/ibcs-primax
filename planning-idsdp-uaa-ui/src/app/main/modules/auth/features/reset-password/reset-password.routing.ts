import {Route} from '@angular/router';
import {AuthResetPasswordComponent} from 'app/main/modules/auth/features/reset-password/reset-password.component';

export const authResetPasswordRoutes: Route[] = [
    {
        path     : ':id/:validity',
        component: AuthResetPasswordComponent
    }
];
