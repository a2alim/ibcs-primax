package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearcherProposalKeyWordResponseDto extends UuidIdHolderRequestBodyDTO{
	
	private Long   researcherProposalId;	
	private String keyWord;
	
}
