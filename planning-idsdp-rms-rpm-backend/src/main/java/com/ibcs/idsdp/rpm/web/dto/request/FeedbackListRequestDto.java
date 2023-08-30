package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;

import lombok.Data;

@Data
public class FeedbackListRequestDto {

	Long researcherProposalId;
	Long researcherProfilePersonalInfoMasterId;
	Long stFiscalYearId;
	String presentationStatus;
	Long expertEvaluatorsId;
	Long userId;

	private PageableRequestBodyDTO pageableRequestBodyDTO;

}
