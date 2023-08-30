import { FileUploadModel } from "../../../shared/model/file-upload.model";

export class ProfileModel {
    id: number;
    uuid: string;
    userId: string;
    userType: string;
    trainingInstituteName: string;
    headOfInstituteName: string;
    designation: string;
    mobileNumber: number;
    dateOfBirth: Date;
    dateOfBirth2: Date;
    email: string;
    permanentAddress: string;
    nidNo: string;
    presentAddress: string;
    profileImage: FileUploadModel;
    signImage: FileUploadModel;
    audioVisual: boolean;
    trainingRoom: boolean;
    supportingStaff: boolean;
    //---------------------
    accountName : string;
    accountNumber : string;
    telephoneNumber : string;
    bankName : string;    
    branchName : string;
    routingNumber : string;
}

