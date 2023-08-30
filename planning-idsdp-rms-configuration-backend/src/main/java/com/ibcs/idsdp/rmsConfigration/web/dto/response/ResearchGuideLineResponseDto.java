package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearchGuideLineResponseDto extends UuidIdHolderRequestBodyDTO {

	private Integer type;
	private String title;
	private String details;
	private Boolean isActive;
	private String titleEn;
	private String detailsEn;

}
