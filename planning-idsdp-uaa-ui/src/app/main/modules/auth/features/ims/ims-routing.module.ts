import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { GuideLineComponent } from './guide-line/guide-line.component';
import { HelpLineComponent } from './help-line/help-line.component';
import { NoticePanelComponent } from './notice-panel/notice-panel.component';
import { ResourcesComponent } from './resources/resources.component';

const routes: Routes = [
  {
    path     : 'faq',
    component: FaqComponent
  },
  {
    path     : 'guide-line',
    component: GuideLineComponent
  },
  {
    path     : 'resources',
    component: ResourcesComponent
  },
  {
    path     : 'notice-panel',
    component: NoticePanelComponent
  },
  {
    path     : 'help-line',
    component: HelpLineComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImsRoutingModule { }
