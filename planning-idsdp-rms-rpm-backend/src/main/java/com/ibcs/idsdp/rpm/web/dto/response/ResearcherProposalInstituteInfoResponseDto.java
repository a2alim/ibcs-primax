package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import lombok.Data;

@Data
public class ResearcherProposalInstituteInfoResponseDto extends UuidIdHolderRequestBodyDTO {

	private Long researcherProposalId;
	private String instituteName;
	private String addressDetails;

	private Integer yearOfEstablishment;
	private String registrationNo;
	private String telephoneNo;
	private String emailAddress;
	private String tinNo;
	private String taxTokenImgOfCurrentYear;
	// for file upload
	private String fileDownloadUrl;
	private String bucketName;
	private String fileName;
	// for file upload
	private Integer isEditable;
	private ResearcherProposalResponseDto researcherProposalDto;

}
