package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import java.util.List;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class TiSpeakerEvaluationRequestDto extends UuidIdHolderRequestBodyDTO {	
	
	private Long proposalId;
	private Long trainerId;
	private Long participantId;
	private Long sessionId;
	
	private List<TiSelectAnswerRequestDto> tiSelectAnswerRequestDto;

}
