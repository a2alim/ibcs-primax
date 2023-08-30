import {NgModule} from '@angular/core';
import {AnswerPreparationCreateComponent} from './answer-preparation-create/answer-preparation-create.component';
import {AnswerPreparationListComponent} from './answer-preparation-list/answer-preparation-list.component';
import {AnswerPreparationRouting} from './answer-preparation.routing';
import { SharedModule } from 'app/main/shared/shared.module';

@NgModule({
    declarations: [
        AnswerPreparationCreateComponent,
        AnswerPreparationListComponent
    ],
    imports: [
        SharedModule,
        AnswerPreparationRouting
    ]
})
export class AnswerPreparationModule {

}
