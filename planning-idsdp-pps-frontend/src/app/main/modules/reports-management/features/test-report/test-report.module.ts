import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TestReportRouting} from "./test-report.routing";
import {TestReportComponent} from "./test-report/test-report.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FlexModule} from "@angular/flex-layout";
import { PdppReportComponent } from './pdpp-report/pdpp-report.component';
import { PfsReportComponent } from './pfs-report/pfs-report.component';
import { DppReportComponent } from './dpp-report/dpp-report.component';
import { ProjecFeasibilityStudyReportComponent } from './projec-feasibility-study-report/projec-feasibility-study-report.component';
import { ProjectManagementSetupReportComponent } from './project-management-setup-report/project-management-setup-report.component';
import { LocationWiseBdReportComponent } from './location-wise-bd-report/location-wise-bd-report.component';
import { DetailedEstimatedCostReportComponent } from './detailed-estimated-cost-report/detailed-estimated-cost-report.component';



@NgModule({
  declarations: [TestReportComponent, PdppReportComponent, PfsReportComponent, DppReportComponent, ProjecFeasibilityStudyReportComponent, ProjectManagementSetupReportComponent,LocationWiseBdReportComponent, DetailedEstimatedCostReportComponent],
    imports: [
        CommonModule, TestReportRouting, MatButtonModule, MatIconModule, FlexModule
    ]
})
export class TestReportModule { }
