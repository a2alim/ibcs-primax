package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class TestRequestDto  extends UuidIdHolderRequestBodyDTO{
	
	private String name;
	private String email;


}
