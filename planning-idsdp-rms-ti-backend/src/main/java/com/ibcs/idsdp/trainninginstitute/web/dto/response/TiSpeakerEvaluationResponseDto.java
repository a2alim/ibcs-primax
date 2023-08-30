package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import java.util.List;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TiSelectAnswerRequestDto;

import lombok.Data;

@Data
public class TiSpeakerEvaluationResponseDto extends UuidIdHolderRequestBodyDTO{		
	private Long proposalId;
	private Long trainerId;
	private Long participantId;
	private Long sessionId;	
	private List<TiSelectAnswerResponseDto> tiSelectAnswerResponseDto;	

}
