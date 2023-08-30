import {FileUploadModel} from "../../../shared/model/file-upload.model";
import {TrainingInstituteProfileModel} from "./training-institute-profile.model";
import {ProposalModel} from "./proposal.model";

export class ChequeCollectionResponse {
    acknowledgementLetter: string;
    chequeAmount: number;
    chequeDate: string;
    chequeImage: FileUploadModel;
    chequeNo: string;
    chequeReceived: boolean;
    chequeReceiverPhoneNo: string;
    collectionDate: string;
    createdBy: string;
    createdOn: string;
    id: number;
    installmentType: string;
    isDeleted: boolean;
    receiverNid: number;
    signatureImageOfCollectingPerson: FileUploadModel;
    signaturedDocument: FileUploadModel;
    tokenNo: number;
    trainingInstituteProfileModel: TrainingInstituteProfileModel;
    updatedBy: string;
    updatedOn: string;
    uuid: string;
    proposalModel: ProposalModel;
}
