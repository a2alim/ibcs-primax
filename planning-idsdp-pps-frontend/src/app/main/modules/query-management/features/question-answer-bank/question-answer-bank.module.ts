import {NgModule} from '@angular/core';
import {QuestionAnswerListComponent} from './question-answer-list/question-answer-list.component';
import {QuestionAnswerViewComponent} from './question-answer-view/question-answer-view.component';
import {QuestionAnswerBankRouting} from './question-answer-bank.routing';
import {SharedModule} from "../../../../shared/shared.module";

@NgModule({
    declarations: [
        QuestionAnswerListComponent,
        QuestionAnswerViewComponent
    ],
    imports: [
        SharedModule,
        QuestionAnswerBankRouting,
    ]
})
export class QuestionAnswerBankModule {

}
