import {Route} from '@angular/router';
import {AuthSignInComponent} from 'app/main/modules/auth/features/sign-in/sign-in.component';

export const authSignInRoutes: Route[] = [
    {
        path     : '',
        component: AuthSignInComponent
    }
];
