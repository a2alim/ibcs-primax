package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ResearcherSupervisorInfoRequestDto extends UuidIdHolderRequestBodyDTO{

	@NotNull
	private Long researcherProposalId;

	@NotBlank
	private String supervisorName;

	@NotBlank
	private String presentOfficeName;

	@NotBlank
	private String presentOfficeAddress;

	
	private String mobileNo;

	
	private String emailAddress;

	
	private String nIdNumber;

	
	private String tinNumber;

	private Integer isEditable;

}
