package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;

import lombok.Data;

@Data
public class EvaluatorNewMemberAttendanceResponseDto extends UuidIdHolderRequestBodyDTO {

	private Long m2ResearcherPresentationId;
	private Long m1ResearcherProposalId;
	private Long stProfileOfExpertEvaluatorsId;
	private Long m2AddNewMemberId;
	private Boolean isPresent;

	public ResearcherPresentationResponseDto researcherPresentationResponseDto;
	public ResearcherProposalResponseDto researcherProposalResponseDto;
	public NewMemberResponseDto newMemberResponseDto;
	public ExpertEvaluatorResponseDto expertEvaluatorResponseDto;
//	public ResearcherPresentationResponseDto researcherPresentation;
//	public ResearcherProposalResponseDto researcherProposal;
//	public NewMemberResponseDto newMember;

}
