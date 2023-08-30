package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearcherSupervisorInfoResponseDto  extends UuidIdHolderRequestBodyDTO{

	private Long researcherProposalId;
	private String supervisorName;
	private String presentOfficeName;
	private String presentOfficeAddress;
	private String mobileNo;
	private String emailAddress;
	private String nIdNumber;
	private String tinNumber;
	private Integer isEditable;
	private ResearcherProposalResponseDto researcherProposalDto;

}
