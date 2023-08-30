package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class EvaluatorNewMemberAttendanceRequestDto extends UuidIdHolderRequestBodyDTO {

	private Long m2ResearcherPresentationId;
	private Long m1ResearcherProposalId;
	private Long stProfileOfExpertEvaluatorsId;
	private Long m2AddNewMemberId;
	private Boolean isPresent;

}
