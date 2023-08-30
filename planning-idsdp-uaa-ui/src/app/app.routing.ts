import { Route } from '@angular/router';

import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from './main/core/auth/guards/auth.guard';
import { NavigationComponent } from './main/modules/components-navigation/components/navigation/navigation.component';
import { SsoComponent } from './main/modules/sso/sso.component';
import { InitialDataResolver } from './app.resolvers';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'navigation' },


    // Auth routes for guests
    {
        path: '',
        //canActivate: [NoAuthGuard],
        //canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () => import('app/main/modules/auth/features/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)
            },
            {
                path: 'forgot-password',
                loadChildren: () => import('app/main/modules/auth/features/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)
            },
            {
                path: 'reset-password',
                loadChildren: () => import('app/main/modules/auth/features/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)
            },
            {
                path: 'sign-in',
                loadChildren: () => import('app/main/modules/auth/features/sign-in/sign-in.module').then(m => m.AuthSignInModule)
            },
            {
                path: 'sign-up',
                loadChildren: () => import('app/main/modules/auth/features/sign-up/sign-up.module').then(m => m.AuthSignUpModule)
            },
            {
                path: 'sign-out',
                loadChildren: () => import('app/main/modules/auth/features/sign-out/sign-out.module').then(m => m.AuthSignOutModule)
            },
            {
                path: 'rms',
                loadChildren: () => import('app/main/modules/auth/features/rms/rms.module').then(m => m.RmsModule)
            },
            {
                path: 'rms/training-institute',
                loadChildren: () => import('app/main/modules/auth/features/rms-ti/rms-ti.module').then(m => m.RmsTiModule)
            },
            {
                //Database Search
                path: 'rms-list',
                loadChildren: () => import('app/main/modules/auth/features/researcher-list-public/researcher-list-public.module').then(m => m.ResearcherListPublicModule)
            },
            {
                path: 'ims',
                loadChildren: () => import('app/main/modules/auth/features/ims/ims.module').then(m => m.ImsModule)
            }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'unlock-session',
                loadChildren: () => import('app/main/modules/auth/features/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)
            },
            {
                path: 'navigation',
                component: NavigationComponent
            },
        ]
    },

    // Landing routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: SsoComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {
            layout: 'empty'
        },
        children: [
            // {path: 'applogin', loadChildren: () => import('app/main/modules/sso/sso.module').then(m => m.SsoModule)},
            { path: 'sso-landing', loadChildren: () => import('app/main/modules/sso/sso.module').then(m => m.SsoModule) }
        ]
    },
    //
    // // Admin routes
    // {
    //     path       : '',
    //     canActivate: [AuthGuard],
    //     canActivateChild: [AuthGuard],
    //     component  : LayoutComponent,
    //     resolve    : {
    //         initialData: InitialDataResolver,
    //     },
    //     children   : [
    //         {path: 'example', loadChildren: () => import('app/main/modules/admin/example/example.module').then(m => m.ExampleModule)},
    //     ]
    // }
];
