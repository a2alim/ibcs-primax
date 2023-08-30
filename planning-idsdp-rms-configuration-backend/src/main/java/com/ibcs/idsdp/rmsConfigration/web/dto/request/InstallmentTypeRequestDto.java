package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class InstallmentTypeRequestDto extends UuidIdHolderRequestBodyDTO{

	private String installmentType;
	private Boolean active;
}
