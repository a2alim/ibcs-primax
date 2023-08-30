package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearcherProposalKeyWordRequestDto extends UuidIdHolderRequestBodyDTO{
	
	
	private Long   researcherProposalId;	
	private String keyWord;	
	private Long isDeleted=0l;
}
