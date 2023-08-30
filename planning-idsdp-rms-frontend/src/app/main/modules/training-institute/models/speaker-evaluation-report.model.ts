import {CourseScheduleModel} from "./course-schedule.model";
import {ProposalModel} from "./proposal.model";
import {TrainersModel} from "./trainers.model";
import {ParticipantModel} from "./participant.model";

export class SpeakerEvaluationReportModel {
    courseScheduleModel: CourseScheduleModel;
    createdBy: string;
    createdOn: string;
    id: number;
    isDeleted: boolean;
    proposalModel: ProposalModel;
    questionOneRating: number;
    questionThreeRating: number;
    questionTwoRating: number;
    trainer: TrainersModel;
    updatedBy: string;
    updatedOn: string;
    uuid: string;
    participantModel: ParticipantModel;
}
