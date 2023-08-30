import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqComponent } from './faq/faq.component';
import { SharedModule } from 'app/main/shared/shared.module';
import { ImsRoutingModule } from './ims-routing.module';
import { GuideLineComponent } from './guide-line/guide-line.component';
import { ResourcesComponent } from './resources/resources.component';
import { NoticePanelComponent } from './notice-panel/notice-panel.component';
import { HelpLineComponent } from './help-line/help-line.component';
import { ImsHeaderComponent } from './ims-header/ims-header.component';
import { ImsFooterComponent } from './ims-footer/ims-footer.component';



@NgModule({
  declarations: [
    FaqComponent,
    GuideLineComponent,
    ResourcesComponent,
    NoticePanelComponent,
    HelpLineComponent,
    ImsHeaderComponent,
    ImsFooterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ImsRoutingModule
  ]
})
export class ImsModule { }
