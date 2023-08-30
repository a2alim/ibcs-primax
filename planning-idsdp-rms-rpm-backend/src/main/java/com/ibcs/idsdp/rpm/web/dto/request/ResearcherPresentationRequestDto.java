package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import com.sun.istack.NotNull;
import lombok.Data;

@Data
public class ResearcherPresentationRequestDto extends UuidIdHolderRequestBodyDTO {

	@NotNull
	private Long m2CreateSeminarId;

	@NotNull
	private Long m1ResearcherProposalId;

	@NotNull
	private Long presentationStatus;

	@NotNull
	private Long presentationType;
	

}
