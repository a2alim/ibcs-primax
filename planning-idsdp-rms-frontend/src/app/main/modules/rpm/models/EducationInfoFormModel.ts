import { FileUploadModel } from "../../training-institute/models/e-nothi.model";

export class EducationInfoFormModel {
    uuid: string;
    id: number;
    profilePersonalInfoId: number;
    certificationName: string;
    passingYearMonth: string;
    scale: string;
    division: string;
    cgpa: string;
    instituteName: string;
    isForeign: boolean;
    uploadCertificateImage: string;
    universityRegNo: string;
    discipline: string;
    isEditable: boolean;
    divisionClassOrCgpa: number;
    registrationNo: string;
    subject: string;
    thesisGroup: number;
    fileUploadModel: FileUploadModel;
    createdOn: Date;
    isDeleted: boolean;
    updatedBy: string;
    updatedOn: Date;
    superviserInformation: string;
}
