package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.model.domain.SectorType;

import lombok.Data;

@Data
public class SubSectorResponseDto extends UuidIdHolderRequestBodyDTO {

	private String subFieldName;
//	private Long sectorTypeId;
	private Integer approvalStatus;
	private Boolean active;
	private SectorType sectorTypeId;

}
