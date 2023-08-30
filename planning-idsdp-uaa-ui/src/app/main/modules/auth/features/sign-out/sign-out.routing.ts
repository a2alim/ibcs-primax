import {Route} from '@angular/router';
import {AuthSignOutComponent} from 'app/main/modules/auth/features/sign-out/sign-out.component';

export const authSignOutRoutes: Route[] = [
    {
        path     : '',
        component: AuthSignOutComponent
    },
    {
        path     : 'rms/:roleType',
        component: AuthSignOutComponent
    }
];
