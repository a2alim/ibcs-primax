package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;

import lombok.Data;

@Data
public class FeedbackListResponseDto {

	Long researcherProposalId;
	
	Long researcherProfilePersonalInfoMasterId;
	
	String researchTitle;
	
	Long stFiscalYearId;
	
	Long userId;
	
	Long totalFeedback;
	
	Long newFeedback;
	
	Long completedFeedback;
	
	Long presentationStatus;
	
	Long researcherPresentationId;
	
	Long createSeminarId;
	
	String researcherProposalUuid;
	
	Long expertEvaluatorsId;
	
	UserResponse user;

}
