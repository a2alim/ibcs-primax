package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearchCategoryTypeResponseDto extends UuidIdHolderRequestBodyDTO {

	private String categoryName;
	private Boolean active;
}
