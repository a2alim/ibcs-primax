package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class PresentationEvaluatorsFeedbackRequestDto extends UuidIdHolderRequestBodyDTO {

	private Long m2ResearcherPresentationId;
	private Long m1ResearcherProposalId;

	private Long researcherUserId;
	private Long stProfileOfExpertEvaluatorsId;

	private Long m2AddNewMemberId;
	private Boolean isPresent;

	private String evaluatorFeedback;
	private Long pageNo1;

	private String researcherFeedback;

	private Long pageNo2;
	private Boolean feedbackCompleted;

	private Boolean isResearcherVisible;
	private Boolean isNew;
	private Boolean isVisible;
	private Boolean isEditable;

	private String m2ResearcherPresentationUuid;
	private String m1ResearcherProposalUuid;
	private String m2AddNewMemberUuid;

}
