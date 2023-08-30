package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;

import lombok.Data;

@Data
public class LinkupProposalWithEvaluatorsResponseDto extends UuidIdHolderRequestBodyDTO{
	
	private ResearcherProposal researcherProposal;
	private Long researcherProposalId;
	
	private Long stProfileOfExpertEvaluatorsId;
	private Long stProfileOfExpertEvaluatorsIdForProMarks;
	private String mailBodyContent;	
	private Integer mailStatus;
	private Integer reviewStatus;	
	private Integer isEditable;
	private String subject;
	private String mailBodyContentForProMarks;
	private String subjectForProMarks;
	private Integer mailStatusForProMarks;
	private Integer reviewStatusForProMarks;	
	private ExpertEvaluatorResponseDto expertEvaluatorsDto;
	
	private Long stProfileOfExpertEvaluatorsIdForResearch;
	private String mailBodyContentForResearch;
	private String subjectForResearch;
	private Integer mailStatusForResearch;
	private Integer reviewStatusForResearch;

}
