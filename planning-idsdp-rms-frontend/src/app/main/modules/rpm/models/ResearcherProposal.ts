import { ExpertEvaluator } from "../../settings/models/expert-evaluator.model";
import { AgreementInstallmentModel } from "../../training-institute/models/agreement-installments.model";
import { AgreementWithResearcherModel } from "./AgreementWithResearcherModel";
import { ResearcherProfilePersonalInfo } from "./ResearcherProfilePersonalInfo";

export class ResearcherProposal {

    id: number;
    uuid: string;
    resProfilePersonalInfoId: number;
    stProfileOfExpertEvaluatorsId: number;
    stFiscalYearId: number;
    stResearchCatTypeId: number;
    stSectorTypeId: number;
    stSubSectorsId: number;

    researchTitle: string;
    //researchTitleBangla: string;
    stSdgsGoalsId: any;
    nationalPlanAlignment: any;
    isCancelled: number;
    cancellationNote: string;
    cancelledBy: number;
    isEditable: number;
    approvalStatus: number;
    mailStatus: number;
    reviewStatus: number;
    reviewStatusTemp: number;
    isFinalSubmit: boolean;

    instituteName: string;
    fiscalYear?: any;
    sector?: any;
    subSector?: any;
    researchCategoryType: any;
    evaluatorList: ExpertEvaluator[];
    linkupProposalWithEvaluatorsId: number;
    linkupProposalWithEvaluatorsUiId: string;
    stProfileOfExpertEvaluatorsIdForProMarks: number;
    mailBodyContent: string;
    subject: string;
    mailBodyContentForProMarks: string;
    subjectForProMarks: string;
    mailStatusForProMarks: number;
    mailStatusForProMarksTemp: number;
    reviewStatusForProMarks: number;
    reviewStatusForProMarksTemp: number;
    mailBodyContentForResearch: string;
    subjectForResearch: string;
    mailStatusForResearch: number;
    reviewStatusForResearch: number;
    reviewStatusForResearchTemp: number;
    sdgsGoalsStr: string;

    divisionId: any;
    districtId: any;
    upzilaId: any;

    divisionName: string;
    districtName: string;
    upzilaName: string;
    evaluatorsUserId: number;
    evaluatorsForProMarksUserId: number;

    researcherProfilePersonalInfoDto: ResearcherProfilePersonalInfo;
    researcherProfilePersonalInfoMaster: ResearcherProfilePersonalInfo;
    researcherSupervisorInfoResponseDto: any;
    agreementWithResearcherResponseDto: AgreementWithResearcherModel;
    agreementInstallmentResponseDtoList: AgreementInstallmentModel[];
    researcherPresentationResponseDtoList: any[];
    stProfileOfExpertEvaluatorsIdForResearch: number;
    evaluatorsForResearchUserId: number;
    proposalTopic: string;
    proposalUuid: string;
}
