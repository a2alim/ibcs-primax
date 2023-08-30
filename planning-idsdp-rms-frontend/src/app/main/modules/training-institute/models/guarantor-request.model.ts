import {FileUploadModel} from "../../../shared/model/file-upload.model";

export class GuarantorRequest {
    id: number;
    designation: string;
    email: string;
    fiscalYearId: number;
    guarantorName: string;
    image: FileUploadModel;
    jobInfo: string;
    mobileNo: string;
    nid: number;
    nidImage: FileUploadModel;
    permanentAddress: string;
    presentAddress: string;
    proposalId: number;
    refundDays: number;
    signatureImage: FileUploadModel;
}
export class UploadFile {
    uploadFile: File;
}
export interface File {
    bucketName:  string;
    createdBy:   string;
    createdOn:   Date;
    downloadUrl: string;
    fileName:    string;
    id:          number;
    isDeleted:   boolean;
    updatedBy:   string;
    updatedOn:   Date;
    uuid:        string;
}


