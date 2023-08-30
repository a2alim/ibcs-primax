import {Route} from '@angular/router';
import {AuthConfirmationRequiredComponent} from 'app/main/modules/auth/features/confirmation-required/confirmation-required.component';

export const authConfirmationRequiredRoutes: Route[] = [
    {
        path     : '',
        component: AuthConfirmationRequiredComponent
    }
];
