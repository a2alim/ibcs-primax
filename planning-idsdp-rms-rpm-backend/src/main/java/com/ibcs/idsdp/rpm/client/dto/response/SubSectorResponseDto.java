package com.ibcs.idsdp.rpm.client.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class SubSectorResponseDto extends UuidIdHolderRequestBodyDTO {

	private String subFieldName;
//	private Long sectorTypeId;
	private Integer approvalStatus;
	private Boolean active;
	private SectorTypeResponseDto sectorTypeId;

}
