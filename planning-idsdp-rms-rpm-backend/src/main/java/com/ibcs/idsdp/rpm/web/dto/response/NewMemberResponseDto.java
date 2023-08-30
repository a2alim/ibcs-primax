package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class NewMemberResponseDto extends UuidIdHolderRequestBodyDTO{
	
	private Long m2ResearcherPresentationId;	
	
	private String  evaluatorName;	
	private String profileSummary;
	
	private Long stCommonTypeId;
	private Long isEditable;

}
