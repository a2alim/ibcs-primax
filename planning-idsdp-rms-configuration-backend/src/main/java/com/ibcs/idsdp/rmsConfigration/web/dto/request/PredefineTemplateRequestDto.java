package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class PredefineTemplateRequestDto extends UuidIdHolderRequestBodyDTO{

	private Integer templateTypeId;
	private String subject;
	private String header;
	private String footer;
	private Boolean active;
}
