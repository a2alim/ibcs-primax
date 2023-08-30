import {FileUploadModel} from "../../../shared/model/file-upload.model";

export class ParticipantModel {
    id: number;
    createdBy: string;
    academicBackgroundModels: AcademicBackgroundModel[];
    dateOfBirth: Date;
    designation: string;
    email: string;
    facebookOrTwitterLink: string;
    fiscalYearId: number;
    gender: string;
    howYouKnowThisProgram: string;
    ifOthers: string;
    image: FileUploadModel;
    isCompleted: boolean;
    name: string;
    nidImage: FileUploadModel;
    nidNo: number;
    organizationAddress: string;
    organizationName: string;
    permanentAddress: string;
    phoneNo: number;
    presentAddress: string;
    proposalId: number;
    yearsOfExperience: number;
    ifAnyJobInfo:boolean
}

export class AcademicBackgroundModel {
    id: number;
    board: string;
    certificateImage: FileUploadModel;
    examinationName: string;
    instituteName: string;
    passingYear: number;
    resultId: string;
    subject: string;
}
