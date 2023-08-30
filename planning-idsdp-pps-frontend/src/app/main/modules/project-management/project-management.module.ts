import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectManagementChildModule } from './features/project-management/project-management-child.module';
import { AuthGuard } from 'app/main/core/auth/guards/auth.guard';
import { SharedModule } from 'app/main/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    ProjectManagementChildModule,
  ],
  providers: [AuthGuard]
})
export class ProjectManagementModule { }
