import { FileUploadModel } from "../../../shared/model/file-upload.model";
import { AcademicBackgroundModel } from "./participant.model";
import { TrainingInstituteProfileModel } from "./training-institute-profile.model";

export class TrainersModel {
    active: boolean;
    address: string;
    age: number;
    createdBy: string;
    createdOn: Date;
    currentJobInstituteName: string;
    currentPosition: string;
    editable: boolean;
    email: string;
    fiscalYearId: number;
    gender: string;
    id: number;
    isDeleted: boolean;
    m3TrainingInstituteProfileId: TrainingInstituteProfileModel;
    name: string;
    nidImage: FileUploadModel;
    nidNumber: number;
    phone: string;
    profileImage: FileUploadModel;
    submitted: boolean;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
    lastAcademicDegree: string;
    proposalId: number;
}
