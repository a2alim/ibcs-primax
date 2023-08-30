package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PresentationEvaluatorsFeedbackResponseDto extends UuidIdHolderRequestBodyDTO {

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
	private LocalDate createdOn;

	public ResearcherPresentationResponseDto researcherPresentationResponseDto;
	public ResearcherProposalResponseDto researcherProposalResponseDto;
	public NewMemberResponseDto newMemberResponseDto;
	public ExpertEvaluatorResponseDto expertEvaluatorResponseDto;
	
	public ResearcherPresentationResponseDto researcherPresentation;	
	public ResearcherProposalResponseDto  researcherProposal;
	
	List<PresentationEvaluatorsFeedbackResponseDto> presentationEvaluatorsFeedbackList;
	PresentationReportResponseDto presentationReportResponseDto;
	
	


}
