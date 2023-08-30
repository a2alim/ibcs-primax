import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResearcherListComponent } from './researcher-list.component';
import { MatModules } from '../../matModule';
import { ResearcherProfileComponent } from './researcher-profile/researcher-profile.component';

const routes:Routes = [
  {
    path:'listq',
    component : ResearcherListComponent,
  }  
];

@NgModule({
  declarations: [
    //ResearcherProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatModules
  ],
})
export class ResearcherListModule { }
