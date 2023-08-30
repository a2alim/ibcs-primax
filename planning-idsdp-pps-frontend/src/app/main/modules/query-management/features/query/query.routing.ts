import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../../core/auth/guards/auth.guard';
import {LayoutComponent} from '../../../../../layout/layout.component';
import {InitialDataResolver} from '../../../../../app.resolvers';
import {QueryCreateComponent} from './query-create/query-create.component';
import {QueryListComponent} from './query-list/query-list.component';

const routes: Routes = [
    {path: 'query/list', component: QueryListComponent},
    {path: 'query/add', component: QueryCreateComponent},
    {path: 'query/edit/:uuid', component: QueryCreateComponent},
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: []
})
export class QueryRouting {
}
