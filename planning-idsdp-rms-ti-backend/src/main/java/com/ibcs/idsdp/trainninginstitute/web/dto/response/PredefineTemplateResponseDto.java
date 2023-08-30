package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class PredefineTemplateResponseDto extends UuidIdHolderRequestBodyDTO {

	private Integer templateTypeId;
	private String subject;
	private String header;
	private String footer;
	private Boolean active;
	private TemplateTypeResponseDto templateTypeDto;
}
