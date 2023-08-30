import {FileUploadModel} from "app/main/shared/model/file-upload.model";

export class TrainingInstituteProfileModel {
    id: number;
    uuid: null;
    isDeleted: boolean;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: null;
    userId: string;
    userType: string;
    trainingInstituteName: string;
    headOfInstituteName: string;
    headInfo: string;
    designation: string;
    mobileNumber: string;
    dateOfBirth: null;
    email: string;
    permanentAddress: string;
    nidNo: string;
    presentAddress: string;
    profileImage: FileUploadModel;
    signImage: FileUploadModel;
}
