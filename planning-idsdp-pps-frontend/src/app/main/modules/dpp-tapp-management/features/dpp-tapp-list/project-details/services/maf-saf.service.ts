import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { DppAnnualPhasingCostConstant } from 'app/main/modules/dpp-tapp-management/constants/dpp-annual-phasing-cost.constant';
import { MafSafModel } from 'app/main/modules/dpp-tapp-management/models/maf-saf-model.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectDetailsPartBUrlConstant } from '../constants/project-details-partb.url.constant';

@Injectable({
  providedIn: 'root'
})
export class MafSafService extends CrudRequestService<MafSafModel>  {

  constructor(public _http: HttpClient) {
    super(_http, environment.ibcs.ppsDppBackendPoint);
  }


  saveProjectDetailsPartB(mafSafModel: MafSafModel): Observable<any> {
    return this._http.post(ProjectDetailsPartBUrlConstant.CREATE_PROJECT_DETAILS, mafSafModel)
  }

  createMtbf(mafSafModel: any): Observable<any> {
    const data = {
      projectConceptUuid: mafSafModel.projectConceptUuid,
      projectConceptId: mafSafModel.projectConceptId,
      isIncludedInAdpRadp: mafSafModel.isIncludedInAdpRadp,
      isMinisterApprovedNewProject: mafSafModel.isMinisterApprovedNewProject,
      approvalDate: mafSafModel.approvalDate,
      isProjectLandRequired: mafSafModel.isProjectLandRequired,
      isProjectFeasibilityStudyRequired: mafSafModel.isProjectFeasibilityStudyRequired,
      isProjectFeasibilityStudyDone: mafSafModel.isProjectFeasibilityStudyDone,
      isEnvironmentalClearance: mafSafModel.isEnvironmentalClearance,
      isLocatedInECA: mafSafModel.isLocatedInECA,
      isEIA: mafSafModel.isEIA,
      isPppNeeded: mafSafModel.isPppNeeded,
      isFinancialEconomicAnalysis: mafSafModel.isFinancialEconomicAnalysis,
      isCompensationOrRehabilitationNeeded: mafSafModel.isCompensationOrRehabilitationNeeded,
      isManpowerApproved: mafSafModel.isManpowerApproved,
      type: mafSafModel.type,
      projectFeasibilityStudyRequiredDescription: mafSafModel.projectFeasibilityStudyRequiredDescription,
      projectFeasibilityStudyDoneDescription: mafSafModel.projectFeasibilityStudyDoneDescription,
      projectFeasibilityStudyAttachId: mafSafModel.projectFeasibilityStudyAttachId,
      environmentalClearanceDescription: mafSafModel.environmentalClearanceDescription,
      environmentalImpactWiseProjectCategory: mafSafModel.environmentalImpactWiseProjectCategory,
      locatedInEcaDescription: mafSafModel.locatedInEcaDescription,
      eiaDescription: mafSafModel.eiaDescription,
      projectLandDescription: mafSafModel.projectLandDescription,

      pppDescription: mafSafModel.pppDescription,
      relevanceWithProgram: mafSafModel.relevanceWithProgram,
      relevanceOfTheProposal: mafSafModel.relevanceOfTheProposal,
      institutionalArrangement: mafSafModel.institutionalArrangement,
      relevanceWithOtherDevelopmentProgrammes: mafSafModel.relevanceWithOtherDevelopmentProgrammes,
      expectedSocioEconomicBenefits: mafSafModel.expectedSocioEconomicBenefits,
      financialEconomicAnalysisDescription: mafSafModel.financialEconomicAnalysisDescription,
      compensationOrRehabilitationDescription: mafSafModel.compensationOrRehabilitationDescription,
      manpowerApprovedAttachId: mafSafModel.manpowerApprovedAttachId,
      sustainabilityOfTheProjectBenefit: mafSafModel.sustainabilityOfTheProjectBenefit,

    };

    const url: string = environment.ibcs.ppsDppBackendPoint + 'maf-saf/create';
    return this._http.post(url, data).pipe(map((res: any) => {
      return res;
    }));
  }


  updateMtbf(mafSafModel: any): Observable<any> {
    const data = {
      projectConceptUuid: mafSafModel.projectConceptUuid,
      projectConceptId: mafSafModel.projectConceptId,
      isIncludedInAdpRadp: mafSafModel.isIncludedInAdpRadp,
      isMinisterApprovedNewProject: mafSafModel.isMinisterApprovedNewProject,
      approvalDate: mafSafModel.approvalDate,
      isProjectLandRequired: mafSafModel.isProjectLandRequired,
      isProjectFeasibilityStudyRequired: mafSafModel.isProjectFeasibilityStudyRequired,
      isProjectFeasibilityStudyDone: mafSafModel.isProjectFeasibilityStudyDone,
      isEnvironmentalClearance: mafSafModel.isEnvironmentalClearance,
      isLocatedInECA: mafSafModel.isLocatedInECA,
      isEIA: mafSafModel.isEIA,
      isPppNeeded: mafSafModel.isPppNeeded,
      isFinancialEconomicAnalysis: mafSafModel.isFinancialEconomicAnalysis,
      isCompensationOrRehabilitationNeeded: mafSafModel.isCompensationOrRehabilitationNeeded,
      isManpowerApproved: mafSafModel.isManpowerApproved,
      uuid: mafSafModel.uuid,
      type: mafSafModel.type,
      projectFeasibilityStudyRequiredDescription: mafSafModel.projectFeasibilityStudyRequiredDescription,
      projectFeasibilityStudyDoneDescription: mafSafModel.projectFeasibilityStudyDoneDescription,
      projectFeasibilityStudyAttachId: mafSafModel.projectFeasibilityStudyAttachId,
      environmentalClearanceDescription: mafSafModel.environmentalClearanceDescription,
      environmentalImpactWiseProjectCategory: mafSafModel.environmentalImpactWiseProjectCategory,
      locatedInEcaDescription: mafSafModel.locatedInEcaDescription,
      eiaDescription: mafSafModel.eiaDescription,
      pppDescription: mafSafModel.pppDescription,
      relevanceWithProgram: mafSafModel.relevanceWithProgram,
      projectLandDescription: mafSafModel.projectLandDescription,
      relevanceOfTheProposal: mafSafModel.relevanceOfTheProposal,
      institutionalArrangement: mafSafModel.institutionalArrangement,
      relevanceWithOtherDevelopmentProgrammes: mafSafModel.relevanceWithOtherDevelopmentProgrammes,
      expectedSocioEconomicBenefits: mafSafModel.expectedSocioEconomicBenefits,
      financialEconomicAnalysisDescription: mafSafModel.financialEconomicAnalysisDescription,
      compensationOrRehabilitationDescription: mafSafModel.compensationOrRehabilitationDescription,
      manpowerApprovedAttachId: mafSafModel.manpowerApprovedAttachId,
      sustainabilityOfTheProjectBenefit: mafSafModel.sustainabilityOfTheProjectBenefit,
    };

    const url: string = environment.ibcs.ppsDppBackendPoint + 'maf-saf/update';
    return this._http.put(url, data).pipe(map((res: any) => {
      return res;
    }));
  }

  getByUuidMaf_Saf(pcUuid: string, type: string) {
    const url: string = environment.ibcs.ppsDppBackendPoint + DppAnnualPhasingCostConstant.GET_MAF_BY_PCUUID + '/' + pcUuid + '/' + type;
    return this._http.get(url).pipe(map((res: any) => {
      return res;
    }));
  }

}
