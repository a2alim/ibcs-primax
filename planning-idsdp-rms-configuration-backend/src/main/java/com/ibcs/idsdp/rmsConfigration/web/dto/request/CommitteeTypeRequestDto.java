package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class CommitteeTypeRequestDto  extends UuidIdHolderRequestBodyDTO{
	
	private String committeeName;
	private Boolean active;

}
