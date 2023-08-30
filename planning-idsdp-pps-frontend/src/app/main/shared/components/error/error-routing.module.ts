import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InitialDataResolver} from 'app/app.resolvers';
import {LayoutComponent} from 'app/layout/layout.component';
import {ForbiddenComponent} from "./forbidden/forbidden.component";

const routes: Routes = [
    {
        path: 'error',
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {path: 'forbidden', component: ForbiddenComponent}
        ]

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ErrorRoutingModule {
}
