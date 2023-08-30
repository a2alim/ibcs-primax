export class SpeakerEvaluationModel {
    courseScheduleId: number;
    participantId: number;
    proposalId: number;
    speakerEvaluationQuestionModels: SpeakerEvaluationQuestionModel[] = new Array<SpeakerEvaluationQuestionModel>();
    trainerId: number;
}

export class SpeakerEvaluationQuestionModel {
    questionId: number;
    rating: string;
}


export class SpeakerEvaluationModelNew {
    tiSelectAnswerRequestDto: any[];
    proposalId: number;
    trainerId: number;
    participantId: number;
    sessionId: number;
}