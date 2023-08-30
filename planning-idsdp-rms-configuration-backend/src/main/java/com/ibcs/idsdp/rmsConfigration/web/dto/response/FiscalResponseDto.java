package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class FiscalResponseDto extends UuidIdHolderRequestBodyDTO {

	private String fiscalYear;
	private String note;
	//private int approvalStatus;
	private Boolean active;
}
