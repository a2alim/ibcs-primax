package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class MemberInSeminarRequestDto extends UuidIdHolderRequestBodyDTO {

	private Long createSeminarId;
	private String name;
	private String emailId;
	private String designation;
	private String mobileNumber;
	private Integer IsDeleted = 0;
	private Long serial;

}
