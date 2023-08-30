package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SpeakerEvaluationQuestionRequest {
    private Long questionId;
    private String rating;
}
