package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class MemberInSeminarResponseDto extends UuidIdHolderRequestBodyDTO {

	private Long createSeminarId;
	private String name;
	private String emailId;
	private String designation;
	private String mobileNumber;
	private Long serial;

	private CreateSeminarResponseDto createSeminarResponseDto;

}
