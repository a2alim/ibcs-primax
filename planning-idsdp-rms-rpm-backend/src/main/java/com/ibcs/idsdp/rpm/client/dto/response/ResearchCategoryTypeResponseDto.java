package com.ibcs.idsdp.rpm.client.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearchCategoryTypeResponseDto extends UuidIdHolderRequestBodyDTO {

	private String categoryName;
	private Boolean active;
}
