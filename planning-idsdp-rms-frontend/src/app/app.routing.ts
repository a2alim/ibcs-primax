import {Route} from '@angular/router';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    {
        path: '*/:sessionId', pathMatch: 'full', redirectTo: 'profile',
    }
    // ,
    // {
    //     path: '',
    //     canActivate: [AuthGuard],
    //     canActivateChild: [AuthGuard],
    //     component: LayoutComponent,
    //     resolve: {initialData: InitialDataResolver},
    //     children: [
    //         {path: 'test', loadChildren: () => import('app/main/modules/test-menu/test.module').then(m => m.SettingsModule), component: TestComponentComponent}

    //     ]
    // }

];
