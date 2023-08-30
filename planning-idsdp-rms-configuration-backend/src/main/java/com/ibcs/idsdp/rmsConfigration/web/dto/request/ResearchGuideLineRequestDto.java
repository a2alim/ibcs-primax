package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearchGuideLineRequestDto extends UuidIdHolderRequestBodyDTO {

	private Integer type;
	private String title;
	private String details;
	private Boolean isActive;
	private String titleEn;
	private String detailsEn;

}
