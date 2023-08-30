package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class CommitteeTypeResponseDto extends UuidIdHolderRequestBodyDTO {
	
	private String committeeName;
	private Boolean active;
}
