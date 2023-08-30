import { ExpertEvaluator } from "../../settings/models/expert-evaluator.model";
import { InstallmentProcessModel } from "./InstallmentProcessModel";

export class GoLetterModel {

    id: number;
    uuid: string;

    goCode: string;
    researcherProposalId: number;
    installmentProcessId: number;
    installmentTypeId: number;
    fiscalYearId: number;
    researchCatTypeId: number;
    totalAmount: number;
    isSend: Boolean;
    subject: string;
    mailBody: string;
    templateTypeId: number;
    predefinedTemplateId: number;
    approvedStatus: string;
    enothiNumber: string;
    bnDate: string;
    enDate: string;


    fileDownloadUrl: string;
    bucketName: string;
    fileName: string;


    installmentProcess: InstallmentProcessModel;
    predefineTemplate: any;
    templateType: any;
    paymentModel: any;
    proposalModel: any;


}
