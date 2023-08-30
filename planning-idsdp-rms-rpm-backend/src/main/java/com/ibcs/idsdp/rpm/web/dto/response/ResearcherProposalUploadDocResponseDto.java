package com.ibcs.idsdp.rpm.web.dto.response;

import java.time.LocalDate;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearcherProposalUploadDocResponseDto  extends UuidIdHolderRequestBodyDTO{
	
	private Long researcherProposalId;
	private Long stDocumentTypeId;
	private String docName;
	private String briefOnDocument;
	private String fileDownloadUrl;
	private String bucketName;
	private String fileName;
	private Integer isEditable;
	private ResearcherProposalResponseDto researcherProposalDto;	
	private LocalDate createdOn;
	private String stDocumentType;

}
