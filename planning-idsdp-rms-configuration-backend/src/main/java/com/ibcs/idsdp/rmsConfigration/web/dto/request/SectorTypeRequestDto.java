package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import javax.validation.constraints.NotBlank;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;

import lombok.Data;

@Data
public class SectorTypeRequestDto  extends UuidIdHolderRequestBodyDTO {
	//private ResearchCategoryType stResearchCategoryTypeId;
	@NotBlank
	private String fieldName;
	private Boolean active;
	private Integer approvalStatus;
}
