import {ProjectDetailsPartB} from "./project-details-partb.model";

export class FinancialAnalysis {
    uuid: string;
    projectConceptUuid: string;
    projectConceptMasterId: number;
    weatherAppraisalStudy: string;
    financialProjectLifeTime: number;
    economicProjectLifeTime: number;
    financialDiscountFactor: number;
    economicDiscountFactor: number;
    financialNpv: number;
    economicNpv: number;
    financialBcr: number;
    economicBcr: number;
    fiancialIrr: number;
    economicIrr: number;

    attachmentSummaryId: any;
    finacialAnalysisAttachmentId: any;
    economicAnalysisAttachmentId: any;
}
