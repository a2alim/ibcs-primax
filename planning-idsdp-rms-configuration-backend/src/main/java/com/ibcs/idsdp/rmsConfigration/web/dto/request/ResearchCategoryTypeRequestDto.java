package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearchCategoryTypeRequestDto extends UuidIdHolderRequestBodyDTO{
	
	private String categoryName;	
	private Boolean active;

}
