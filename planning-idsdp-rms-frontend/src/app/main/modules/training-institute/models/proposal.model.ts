import {TrainingInstituteProfileModel} from "./training-institute-profile.model";

export class ProposalModel {
    id: number;
    uuid: string;
    isDeleted: boolean;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
    trainingName: string;
    instituteName: string;
    instituteType: string;
    instituteHead: string;
    previousExperience: string;
    trainingDuration: number;
    courseNo: number;
    programDate: Date;
    endDate: Date;
    typeOfCourse: string;
    noOfTrainer: number;
    noOfTrainee: number;
    principalAndStrategies: string;
    courseObjective: string;
    trainingMethods: string;
    infrastructuralFacility: string;
    anyCourseFeeFromTrainee: string;
    otherRelevantInfo: string;
    fiscalYearId: number;
    isEditable: boolean;
    isSubmitted: boolean;
    isSubmittedString: String;
    trainingInstituteProfileModel: TrainingInstituteProfileModel;
    proposalStatus: string;
    isShortListed: boolean;
}
