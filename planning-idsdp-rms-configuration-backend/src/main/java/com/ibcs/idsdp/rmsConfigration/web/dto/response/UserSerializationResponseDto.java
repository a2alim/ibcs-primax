package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class UserSerializationResponseDto extends UuidIdHolderRequestBodyDTO {
	private Integer serial;
	private Integer userId;
	private String designation;
	private Boolean isActive;
}
