package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.persistence.Column;

@Data
public class FeedbackBetweenEvaAndResearcherRequestDto extends UuidIdHolderRequestBodyDTO {

	private Long m2ResearcherPresentationId;
	
	private String sendTo;
	
	private Long m2CreateSeminarId;
	
	private Long m1ResearcherProposalId;
	
	private String subject;
	
	private String receiverMailAddress;
	
	@Column(columnDefinition = "TEXT")
	private String mailBody;
	
	private Boolean isSent;

}
