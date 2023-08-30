import {FileUploadModel} from "../../../shared/model/file-upload.model";

export class AttendanceResponse {
    courseModel: CourseModel;
    courseScheduleModel: CourseScheduleModel;
    date: Date;
    editable: boolean;
    participantAttendanceModels: ParticipantAttendanceModel[];
    proposalModel: ProposalModel;
    trainer: Trainer;
    attendancePhoto: FileUploadModel;

    proposalId: number = 0;
    sessionId: number;
    speakerId: number;
}

export class CourseModel {
    string: string;
    courseScheduleModels: CourseScheduleModel[];
    createdBy: string;
    createdOn: Date;
    editable: boolean;
    fiscalYearId: number;
    id: number;
    isDeleted: boolean;
    proposalModel: ProposalModel;
    submitted: boolean;
    totalHours: number;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
}


export class CourseScheduleModel {
    createdBy: string;
    createdOn: Date;
    date: Date;
    day: string;
    id: number;
    isDeleted: boolean;
    session: string;
    speakers: Trainer[];
    time: string;
    topic: string;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
}

export class Trainer {
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
    name: string;
    nidNumber: number;
    phone: string;
    submitted: boolean;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
}

export class ProposalModel {
    anyCourseFeeFromTrainee: string;
    courseNo: number;
    courseObjective: string;
    createdBy: string;
    createdOn: Date;
    fiscalYearId: number;
    id: number;
    infrastructuralFacility: string;
    instituteHead: string;
    instituteName: string;
    instituteType: string;
    isDeleted: boolean;
    isEditable: boolean;
    isShortListed: boolean;
    isSubmitted: boolean;
    noOfTrainee: number;
    noOfTrainer: number;
    otherRelevantInfo: string;
    previousExperience: string;
    principalAndStrategies: string;
    programDate: Date;
    proposalStatus: string;
    trainingDuration: number;
    trainingMethods: string;
    trainingName: string;
    typeOfCourse: string;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
}

export class ParticipantAttendanceModel {
    createdBy: string;
    createdOn: Date;
    id: number;
    isDeleted: boolean;
    isPresent: boolean;
    participantModel: ParticipantModel;
    speakerComment: string;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
    participantId: number;
    participantName: string;
    phoneNo: string;
}

export class ParticipantModel {
    createdBy: string;
    createdOn: Date;
    dateOfBirth: Date;
    designation: string;
    editable: boolean;
    email: string;
    facebookOrTwitterLink: string;
    fiscalYearId: number;
    gender: string;
    howYouKnowThisProgram: string;
    id: number;
    ifOthers: string;
    isDeleted: boolean;
    name: string;
    nidNo: number;
    organizationAddress: string;
    organizationName: string;
    permanentAddress: string;
    phoneNo: string;
    presentAddress: string;
    proposalModel: ProposalModel;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
    yearsOfExperience: number;
}
