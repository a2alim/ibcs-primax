package com.ibcs.idsdp.rpm.web.dto.response;

import lombok.Data;

@Data
public class ResearcherProposalDto {

	private Long id;
	private String researchTitle;
	private Long stResearchCatTypeId;
	private Long stFiscalYearId;
	private Long approvalStatus;
	private String supervisorName;
	private Long stProfileOfExpertEvaluatorsId;

	private String researchCatTypeName;
	private String fiscalYearName;
	private String profileOfExpertEvaluatorsName;

}
