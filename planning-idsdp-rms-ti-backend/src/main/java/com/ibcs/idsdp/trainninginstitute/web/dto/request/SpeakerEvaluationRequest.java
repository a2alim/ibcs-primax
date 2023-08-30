package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import lombok.*;

import java.util.List;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SpeakerEvaluationRequest {

    private Long proposalId;

    private Long courseScheduleId;

    private Long trainerId;

    private Long participantId;

    List<SpeakerEvaluationQuestionRequest> speakerEvaluationQuestionModels;
}
