package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class LinkupProposalWithEvaluatorsRequestDto extends UuidIdHolderRequestBodyDTO {

//	private ResearcherProposalResponseDto researcherProposalDto;
	private Long researcherProposalId;
	private Long stProfileOfExpertEvaluatorsId;	
	private Long stProfileOfExpertEvaluatorsIdForProMarks;	
	private String mailBodyContent;
	private Integer mailStatus;
	private Integer reviewStatus;
	private Integer isEditable;
	private String subject;
	private String emailFor;
	private String mailBodyContentForProMarks;
	private String subjectForProMarks;
	private Integer mailStatusForProMarks;
	private Integer reviewStatusForProMarks;	
	
	private Long stProfileOfExpertEvaluatorsIdForResearch;
	private String mailBodyContentForResearch;
	private String subjectForResearch;
	private Integer mailStatusForResearch;
	private Integer reviewStatusForResearch;
	
}
