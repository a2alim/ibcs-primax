package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;

import lombok.Data;

@Data
public class PresentationReportResponseDto extends UuidIdHolderRequestBodyDTO{	
	
	private CreateSeminar createSeminar;
	
	private String subject;
	
	private String firstContent;
	
	private String lastContent;
	
	private Boolean isEditable;

}
