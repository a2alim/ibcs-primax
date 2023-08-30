package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class InstallmentTypeResponseDto extends UuidIdHolderRequestBodyDTO {

	private String installmentType;
	private Boolean active;
}
