import {FileUploadModel} from "../../../shared/model/file-upload.model";
import {TrainingInstituteProfileModel} from "./training-institute-profile.model";
import {ProposalModel} from "./proposal.model";

export class ProgressVerificationModel {
    comment: string;
    createdBy: string;
    createdOn: Date;
    examinerUserId: string;
    fiscalYearId: number;
    id: number;
    isDeleted: boolean;
    monitoring: string;
    nothi: FileUploadModel;
    numberOfManPower: number;
    organizationActivity: string;
    researchTitle: string;
    trainingInstituteProfileModel: TrainingInstituteProfileModel;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
    verificationDate: Date;
    proposalModel: ProposalModel;
    examiner: string;
}

