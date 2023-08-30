import { FileUploadModel } from "../../training-institute/models/e-nothi.model";

export class ResearchExprienceFormModel {
    id:number;
    profilePersonalInfoId: number;
    researchType: string;
    researchTopic: string;
    researchYear: string;
    supervisorDetail:string;
    researchStatus:string;
    fundingOrganization:string;
    researchValueInBDT:number;
    researchFindingAndImportance :string;
    totalResearchExp :number;
    isEditable:boolean;
    isForeign:boolean;
    isDeleted: boolean;
    fileUploadModel:FileUploadModel;
    createdOn:   Date;
    updatedBy:   string;
    updatedOn:   Date;
}
