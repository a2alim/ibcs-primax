package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ResearcherProposalUploadDocRequestDto extends UuidIdHolderRequestBodyDTO{

	@NotNull
	private Long researcherProposalId;
	
	private String researcherProposalUuid;

	@NotNull
	private Long stDocumentTypeId;

	@NotBlank
	private String docName;

	@NotBlank
	private String briefOnDocument;

	
	private String fileDownloadUrl;

	private String bucketName;

	private String fileName;

	private Integer isEditable;

	private Integer deleted;

}
