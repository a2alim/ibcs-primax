package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.CommonTypesResponseDto;

import lombok.Data;

@Data
public class ResearcherPresentationResponseDto extends UuidIdHolderRequestBodyDTO {

	private Long m2CreateSeminarId;
	private Long m1ResearcherProposalId;
	private Long presentationStatus;
	private Long presentationType;
	private CreateSeminarResponseDto createSeminarDto;
	private ResearcherProposalResponseDto researcherProposalDto;
	private CommonTypesResponseDto commonTypesResponseDto;

}
