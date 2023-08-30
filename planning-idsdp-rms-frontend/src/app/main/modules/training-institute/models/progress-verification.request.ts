import { FileUploadModel } from "../../../shared/model/file-upload.model";
import { ProposalModel } from "./proposal.model";

export class ProgressVerificationRequest {


    comment: string;
    examinerUserId: string;
    fiscalYearId: number;
    monitoring: string;
    nothi: FileUploadModel;
    numberOfManPower: number;
    organizationActivity: string;
    trainingInstituteProfileId: number;
    verificationDate: Date;
    proposalId: number;
    proposalModel: ProposalModel;
}
