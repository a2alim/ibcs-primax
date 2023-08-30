package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class TemplateTypeRequestDto extends UuidIdHolderRequestBodyDTO{

	private String templateType;
	private Boolean active;
}
