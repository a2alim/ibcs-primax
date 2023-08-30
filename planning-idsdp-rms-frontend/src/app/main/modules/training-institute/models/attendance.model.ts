import {ProposalModel} from "./proposal.model";
import {ParticipantModel} from "./participant.model";
import {TrainersModel} from "./trainers.model";

export class AttendanceModel {
    courseScheduleModel: any;
    createdBy: string;
    createdOn: Date;
    date: Date;
    editable: boolean;
    id: number;
    isDeleted: boolean;
    participantAttendanceModels: ParticipantAttendanceModel[];
    proposalModel: ProposalModel;
    trainer: TrainersModel;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
    proposalId: number;
    sessionId: number;
    speakerId: number;
}


export class ParticipantAttendanceModel {
    createdBy: string;
    createdOn: Date;
    id: number;
    isDeleted: boolean;
    isPresent: boolean;
    participantModel: ParticipantModel;
    participantId: number;
    participantName: string;
    speakerComment: string;
    updatedBy: string;
    updatedOn: Date;
    uuid: string;
}

// export class AttendanceModel {
//     proposalId: number;
//     createdBy: string;
//     createdOn: Date;
//     date: Date;
//     editable: boolean;
//     id: number;
//     isDeleted: boolean;
//     participantAttendanceModels: ParticipantAttendanceModel[];
//     sessionId: number;
//     speakerId: number;
//     updatedBy: string;
//     updatedOn: Date;
//     uuid: string;
//
// }
//
// export class ParticipantAttendanceModel {
//     createdBy?: string;
//     createdOn?: Date;
//     id?: number;
//     isDeleted?: boolean;
//     participantId?: number;
//     present?: boolean;
//     speakerComment?: string;
//     updatedBy?: string;
//     updatedOn?: Date;
//     uuid?: string;
//     participantName: string;
// }
