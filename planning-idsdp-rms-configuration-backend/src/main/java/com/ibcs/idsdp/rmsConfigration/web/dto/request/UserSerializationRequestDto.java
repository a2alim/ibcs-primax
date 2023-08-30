package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.persistence.Column;

@Data
public class UserSerializationRequestDto extends UuidIdHolderRequestBodyDTO{
	private Integer serial;
	private Integer userId;
	private String designation;
	private Boolean isActive;
}
