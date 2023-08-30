package com.ibcs.idsdp.rpm.web.dto.request;

import javax.validation.constraints.NotNull;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearcherProposalRscWorkingInOrgRequestDto extends UuidIdHolderRequestBodyDTO{

	@NotNull
	private Long researcherProposalId;
	private String researcherName;
	private Integer age;
	private String occupation;
	private Boolean isMainResearcher;
	private String mobileNo;
	private String emailAddress;
	private String designation;
	private String nidNo;
	private String telephoneNo;
	private String educationQualification;
	private Integer isDeleted=0;
	private String researcherTypeName;
	

}
