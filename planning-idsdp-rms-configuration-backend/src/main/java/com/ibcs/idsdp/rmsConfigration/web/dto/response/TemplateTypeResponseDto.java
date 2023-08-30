package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class TemplateTypeResponseDto extends UuidIdHolderRequestBodyDTO{

	private String templateType;
	private Boolean active;
}
