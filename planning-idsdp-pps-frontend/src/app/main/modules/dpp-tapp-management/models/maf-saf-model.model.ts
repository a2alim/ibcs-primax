export class MafSafModel {

    projectConceptUuid: string;
    uuid: string;
    type: string;
    projectConceptId: number;

    isForeignAid: boolean;
    isIncludedInAdpRadp: boolean;
    isMinisterApprovedNewProject: boolean;
    approvalDate: Date;

    isProjectLandRequired: boolean;
    isProjectFeasibilityStudyRequired: boolean;
    isProjectFeasibilityStudyDone: boolean;
    isEnvironmentalClearance: boolean;
    isLocatedInECA: boolean;
    isEIA: boolean;
    isPppNeeded: boolean;
    isFinancialEconomicAnalysis: boolean;
    isCompensationOrRehabilitationNeeded: boolean;
    isManpowerApproved: boolean;

    projectLandDescription: string;
    projectFeasibilityStudyRequiredDescription: string;
    projectFeasibilityStudyDoneDescription: string;
    projectFeasibilityStudyAttachId: string;
    environmentalClearanceDescription: string;
    environmentalImpactWiseProjectCategory: string;
    locatedInEcaDescription: string;
    eiaDescription: string;
    pppDescription: string;
    relevanceWithProgram: string;
    relevanceOfTheProposal: string;
    institutionalArrangement: string;
    relevanceWithOtherDevelopmentProgrammes: string;
    expectedSocioEconomicBenefits: string;
    financialEconomicAnalysisDescription: string;
    compensationOrRehabilitationDescription: string;
    manpowerApprovedAttachId: string;
    sustainabilityOfTheProjectBenefit: string;
}


export class mafsaf {
    static MAF = 'MAF';
    static SAF = 'SAF';
}
