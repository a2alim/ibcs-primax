import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../../core/auth/guards/auth.guard';
import {LayoutComponent} from '../../../../../layout/layout.component';
import {InitialDataResolver} from '../../../../../app.resolvers';
import {QuestionAnswerListComponent} from './question-answer-list/question-answer-list.component';
import {QuestionAnswerViewComponent} from './question-answer-view/question-answer-view.component';

const routes: Routes = [
    {path: 'question-answer-bank/list', component: QuestionAnswerListComponent},
    {path: 'question-answer-bank/view/:uuid', component: QuestionAnswerViewComponent},
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
export class QuestionAnswerBankRouting {
}
