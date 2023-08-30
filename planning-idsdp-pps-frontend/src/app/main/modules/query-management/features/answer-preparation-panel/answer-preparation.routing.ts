import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../../core/auth/guards/auth.guard';
import {LayoutComponent} from '../../../../../layout/layout.component';
import {InitialDataResolver} from '../../../../../app.resolvers';
import {AnswerPreparationListComponent} from './answer-preparation-list/answer-preparation-list.component';
import {AnswerPreparationCreateComponent} from './answer-preparation-create/answer-preparation-create.component';

const routes: Routes = [
    {path: 'answer-preparation-panel/list', component: AnswerPreparationListComponent},
    {path: 'answer-preparation-panel/add-new', component: AnswerPreparationCreateComponent},
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
export class AnswerPreparationRouting {
}
