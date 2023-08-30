package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class TiSelectAnswerRequestDto extends UuidIdHolderRequestBodyDTO{	
	
	private Long speakerEvaluationId;	
	
	private Long stCommonTypeId;	
	
	private Integer answer;

}
