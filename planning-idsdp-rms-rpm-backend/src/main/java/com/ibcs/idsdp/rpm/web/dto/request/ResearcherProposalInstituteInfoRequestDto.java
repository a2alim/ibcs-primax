package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

import javax.persistence.Column;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ResearcherProposalInstituteInfoRequestDto extends UuidIdHolderRequestBodyDTO {

	@NotNull
	private Long researcherProposalId;

	@NotBlank
	private String instituteName;

	@NotBlank
	private String addressDetails;

	@NotNull
	private Integer yearOfEstablishment;

	private String registrationNo;

	@NotBlank
	private String telephoneNo;

	@NotBlank
	private String emailAddress;

	private String tinNo;

	private String taxTokenImgOfCurrentYear;

	// for file upload
	private String fileDownloadUrl;
	private String bucketName;
	private String fileName;
	// for file upload

	private Integer isEditable;

}
