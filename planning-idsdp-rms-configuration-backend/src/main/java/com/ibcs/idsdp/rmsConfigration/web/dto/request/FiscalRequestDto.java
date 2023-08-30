package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.persistence.Column;

@Data
public class FiscalRequestDto extends UuidIdHolderRequestBodyDTO{

	private String fiscalYear;
	private String note;
	//private int approvalStatus;
	private Boolean active;
}
