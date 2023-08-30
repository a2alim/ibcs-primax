import { TrainingInstituteProfileModel } from "./training-institute-profile.model";
import { FileUploadModel } from "../../../shared/model/file-upload.model";
import { TrainingBudgetModel } from "./training-budget.model";
import { ProposalModel } from "./proposal.model";

export class PartialFinalPaymentModel {
    chalanNo: string;
    createdBy: string;
    createdOn: Date;
    dateOfAcceptance: Date;
    fiscalYearId: number;
    id: number;
    installmentAmount: number;
    installmentDate: Date;
    installmentType: string;
    isDeleted: boolean;
    letterText: string;
    paymentBillVoucherModels: PaymentBillVoucherModel[];
    paymentVoucherModels: PaymentVoucherModel[];
    status: string;
    trainingInstituteProfileModel: TrainingInstituteProfileModel;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
    proposalId: number;
    proposalModel: ProposalModel;
    proposalName: string;
    memorandumNo: string;
    sendingDate: Date;
    sourceNo: string;
    sourceDate: Date;
}

export class PaymentBillVoucherModel {
    budgetExpenditureAmount: number;
    partialFinalPaymentId: number;
    createdBy: string;
    createdOn: Date;
    expenditureAmount: number;
    expenditureId: number;
    id: number;
    isDeleted: boolean;
    netPaymentAmount: number;
    trainingBudgetModel: TrainingBudgetModel;
    trainingBudgetId: number;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
    vatAndTaxAmount: number;
    vatAndTaxPercentage: number;
    voucherNumber: number;

    // For File Upload
    fileDownloadUrl: string;
    bucketName: string;
    fileName: string;

}

export class PaymentVoucherModel {
    boucherImage: FileUploadModel;
    createdBy: string;
    createdOn: Date;
    id: number;
    isDeleted: boolean;
    serialNo: number;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
}


