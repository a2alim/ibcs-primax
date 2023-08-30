import {FileUploadModel} from "../../../shared/model/file-upload.model";

export interface GuarantorResponse {
    id: number;
    uuid: string;
    isDeleted: boolean;
    createdBy: number;
    createdOn: string;
    updatedBy: string;
    updatedOn: string;
    courseId: number;
    guarantorName: string;
    jobInfo: string;
    designation: string;
    mobileNo: number;
    email: string;
    presentAddress: string;
    permanentAddress: string;
    refundDays: number;
    image: FileUploadModel;
    nid: string;
    signatureImage: FileUploadModel;
    nidImage: FileUploadModel;
    isActive: boolean;
    fiscalYearId: number;
}
