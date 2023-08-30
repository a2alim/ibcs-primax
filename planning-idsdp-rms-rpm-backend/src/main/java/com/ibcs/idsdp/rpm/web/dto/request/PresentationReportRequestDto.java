package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class PresentationReportRequestDto extends UuidIdHolderRequestBodyDTO{
	
	private String createSeminarUuid;
	
	private String subject;
	
	private String firstContent;
	
	private String lastContent;
	
	private Boolean isEditable;

}
