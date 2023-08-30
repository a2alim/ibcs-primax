import {FileUploadModel} from "../../../shared/model/file-upload.model";

export class ChequeCollectionRequest{
    acknowledgementLetter: string;
    chequeAmount: number;
    chequeDate: string;
    chequeImage: FileUploadModel;
    chequeNo: string;
    chequeReceived: boolean;
    chequeReceiverPhoneNo: string;
    collectionDate: string;
    installmentType: string;
    instituteId: number;
    receiverNid: number;
    signatureImageOfCollectingPerson: FileUploadModel;
    tokenNo: number;
    proposalId: number;
}
