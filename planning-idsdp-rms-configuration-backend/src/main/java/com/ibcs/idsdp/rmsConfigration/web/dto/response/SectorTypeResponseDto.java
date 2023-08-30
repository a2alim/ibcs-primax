package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;

import lombok.Data;

@Data
public class SectorTypeResponseDto extends UuidIdHolderRequestBodyDTO {

	private Boolean active;
	private String fieldName;
	private Integer approvalStatus;
	//private ResearchCategoryType stResearchCategoryTypeId;

}
