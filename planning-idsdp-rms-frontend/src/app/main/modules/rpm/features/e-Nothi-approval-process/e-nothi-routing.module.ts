import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FywApprovalDetailsComponent } from '../fiscalYear-wise-sector-sub-sector/approval-process/fyw-approval-details/fyw-approval-details.component';
import { FywApprovalListComponent } from '../fiscalYear-wise-sector-sub-sector/approval-process/fyw-approval-list/fyw-approval-list.component';
import { FywSendToEnothiComponent } from '../fiscalYear-wise-sector-sub-sector/approval-process/fyw-send-to-enothi/fyw-send-to-enothi.component';
import { ProposalDetailsComponent } from './research-proposals/proposal-details/proposal-details.component';
import { ProposalFormComponent } from './research-proposals/proposal-form/proposal-form.component';
import { ProposalListComponent } from './research-proposals/proposal-list/proposal-list.component';
import { ResearcherAgreementDetailsComponent } from './researcher-agreement/researcher-agreement-details/researcher-agreement-details.component';
import { ResearcherAgreementFormComponent } from './researcher-agreement/researcher-agreement-form/researcher-agreement-form.component';
import { ResearcherAgreementListComponent } from './researcher-agreement/researcher-agreement-list/researcher-agreement-list.component';
import { ResearcherInstallmentGoDetailsComponent } from './researcher-installment-go/researcher-installment-go-details/researcher-installment-go-details.component';
import { ResearcherInstallmentGoFormComponent } from './researcher-installment-go/researcher-installment-go-form/researcher-installment-go-form.component';
import { ResearcherInstallmentGoListComponent } from './researcher-installment-go/researcher-installment-go-list/researcher-installment-go-list.component';

const routes: Routes = [

  {path: 'fyw-approval-list', component: FywApprovalListComponent},
  {path: 'fyw-approval-upload', component: FywSendToEnothiComponent},
  {path: 'fyw-approval-details', component: FywApprovalDetailsComponent},

  { path: 'proposal-list', component: ProposalListComponent },
  { path: 'add-proposal', component: ProposalFormComponent },
  { path: 'proposal-details', component: ProposalDetailsComponent },

  { path: 'researcher-agreement-list', component: ResearcherAgreementListComponent },
  { path: 'researcher-agreement-add', component: ResearcherAgreementFormComponent },
  { path: 'researcher-agreement-details', component: ResearcherAgreementDetailsComponent },

  { path: 'researcher-inst-go-list', component: ResearcherInstallmentGoListComponent },
  { path: 'researcher-inst-go-add', component: ResearcherInstallmentGoFormComponent },
  { path: 'researcher-inst-go-details', component: ResearcherInstallmentGoDetailsComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ENothiRoutingModule { }
