package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearchProgressReportRequesteDto extends UuidIdHolderRequestBodyDTO {

	private PageableRequestBodyDTO pageableRequestBodyDTO;

	private Long researcherProposalInfoId;
	private String researchTitle;
	private Long fiscalYearId;
	private Long researchCatTypeId;
	private Double researchCompletedPercentage;
	private String details;
	private Boolean isSend;
	private Boolean isEditable;
	private String bucketName;
	private String fileName;
	private String downloadUrl;
	private String mode;
}
