package com.ibcs.idsdp.rpm.web.dto.response;

import java.util.ArrayList;
import java.util.List;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;

import lombok.Data;

@Data
public class ResearchProgressReportResponseDto extends UuidIdHolderRequestBodyDTO {

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

	private List<TaskListResponseDto> taskLists = new ArrayList<>();
	private ResearcherProposal researcherProposalInfo;
	private FiscalResponseDto fiscalResponseDto;
	private ResearchCategoryTypeResponseDto researchCategoryTypeResponseDto;
}
