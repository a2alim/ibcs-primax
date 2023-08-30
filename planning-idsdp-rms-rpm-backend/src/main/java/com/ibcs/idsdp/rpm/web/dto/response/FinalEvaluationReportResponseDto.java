package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class FinalEvaluationReportResponseDto extends UuidIdHolderRequestBodyDTO {

	private Long m1ResearcherProposalInfoId;
	private String researchObjectives;
	private String describeProblem;
	private String note;
	private Boolean isResearchRulesAreFollowed;
	private Boolean isEditable;
	private Boolean isActive;

}
