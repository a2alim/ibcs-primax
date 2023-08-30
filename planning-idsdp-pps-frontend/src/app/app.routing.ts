import {Route} from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {AuthGuard} from "./main/core/auth/guards/auth.guard";
import {InitialDataResolver} from "./app.resolvers";

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Project Concept managemnet routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {applyPreload: true},
        loadChildren: () => import('app/main/modules/project-concept-management/project-concept-management.module')
            .then(m => m.ProjectConceptManagementModule),
    },

    // Configuration managemnet routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {applyPreload: false},
        loadChildren: () => import('app/main/modules/configuration-management/settings.module')
            .then(m => m.SettingsModule),
    },

    // project management routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {applyPreload: false},
        loadChildren: () => import('app/main/modules/query-management/query-management.module')
            .then(m => m.QueryManagementModule),
    },

    // Feasibility Study Management Module routes
    {
        path: 'feasibility-study',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {applyPreload: true},
        loadChildren: () => import('app/main/modules/feasibility-study-management/feasibility-study-management.module')
            .then(m => m.FeasibilityStudyManagementModule),
    },


    // Dpp tapp managemnet routes
    {
        path: 'dpp-tapp',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {applyPreload: true},
        loadChildren: () => import('app/main/modules/dpp-tapp-management/dpp-tapp-management.module')
            .then(m => m.DppTappManagementModule),
    },


    // RDpp Rtapp managemnet routes
    {
        path: 'rdpp-rtapp',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {applyPreload: true},
        loadChildren: () => import('app/main/modules/rdpp-rtapp-management/rdpp-rtapp-management.module')
            .then(m => m.RdppRtappManagementModule),
    },

    // project management routes
    {
        path: 'project-management',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {applyPreload: true},
        loadChildren: () => import('app/main/modules/project-management/project-management.module')
            .then(m => m.ProjectManagementModule),
    },


];
