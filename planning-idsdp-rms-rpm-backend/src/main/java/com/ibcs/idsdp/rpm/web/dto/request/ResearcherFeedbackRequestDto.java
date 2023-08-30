package com.ibcs.idsdp.rpm.web.dto.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ResearcherFeedbackRequestDto {

	@NotBlank
	private String uuid;
	
//	private Long researcherUserId;

	@NotBlank
	private String researcherFeedback;

	@NotNull
	private Long pageNo2;

}
