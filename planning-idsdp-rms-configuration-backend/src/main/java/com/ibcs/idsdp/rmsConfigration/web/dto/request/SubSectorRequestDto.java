package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.model.domain.SectorType;

import lombok.Data;

@Data
public class SubSectorRequestDto extends UuidIdHolderRequestBodyDTO{	
	
	private String subFieldName;	
	private SectorType sectorTypeId;	
	private Integer approvalStatus;
	private Boolean active;

}
