package com.ibcs.idsdp.rpm.web.dto.response;

import javax.persistence.Column;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearcherProposalRscWorkingInOrgResponseDto  extends UuidIdHolderRequestBodyDTO{
	
	
	private Long researcherProposalId;
	private String researcherName;
	private String telephoneNo;
	private String memorandumNo;

	@Column(length = 11)
	private Integer age;

	@Column(length = 255)
	private String occupation;
	private Boolean isMainResearcher;

	private String mobileNo;
	private String emailAddress;
	private String nidNo;
	private String designation;
	private String educationQualification;
	private ResearcherProposalResponseDto researcherProposalDto;
	private String researcherTypeName;
	
	

}
