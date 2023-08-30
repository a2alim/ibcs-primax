import {FileUploadModel} from "../../training-institute/models/e-nothi.model";

export interface PublicationInfoFormModel {
    id: number,
    profilePersonalInfoId: number;
    publishedIn: string;
    articleTitle: string;
    roleInTeam: string;
    journalPaperNature: number;
    publicationDate: string;
    issn: string;
    isbn: string;
    uploadRelevantDoc: string;
    isEditable: boolean;
    fileUploadModel:FileUploadModel;
    createdOn:   Date;
    isDeleted:   boolean;
    updatedBy:   string;
    updatedOn:   Date;
    orchid : number;
}
