package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class FeedbackBetweenEvaAndResearcherResponseDto extends UuidIdHolderRequestBodyDTO{
	
	private Long m2ResearcherPresentationId;
	private String sendTo;
	private Long m2CreateSeminarId;
	private Long m1ResearcherProposalId;
	private String subject;
	private String receiverMailAddress;
	private String mailBody;
	private Boolean isSent;

}
