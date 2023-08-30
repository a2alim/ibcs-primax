import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { AuthGuard } from '../../core/auth/guards/auth.guard';
import { QueryModule } from './features/query/query.module';
import { QuestionAnswerBankModule } from './features/question-answer-bank/question-answer-bank.module';
import { AnswerPreparationModule } from './features/answer-preparation-panel/answer-preparation.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/main/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    QueryModule,
    QuestionAnswerBankModule,
    AnswerPreparationModule,
  ],
  providers: [AuthGuard],
})
export class QueryManagementModule {}
