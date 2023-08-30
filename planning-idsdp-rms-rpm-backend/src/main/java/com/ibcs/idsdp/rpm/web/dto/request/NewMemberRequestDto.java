package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class NewMemberRequestDto extends UuidIdHolderRequestBodyDTO {

	private Long m2ResearcherPresentationId;
	
	private String evaluatorName;
	private String profileSummary;
	private Long stCommonTypeId;
	private Long isEditable;
	
	private Integer deleted;

}
