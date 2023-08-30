import {Route} from '@angular/router';
import {AuthUnlockSessionComponent} from 'app/main/modules/auth/features/unlock-session/unlock-session.component';

export const authUnlockSessionRoutes: Route[] = [
    {
        path     : '',
        component: AuthUnlockSessionComponent
    }
];
