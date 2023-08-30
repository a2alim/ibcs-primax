package com.ibcs.idsdp.rpm.web.dto.response;

import java.time.LocalDate;
import java.util.Date;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalInfo;

import lombok.Data;

@Data
public class ResearchActionResponseDto extends UuidIdHolderRequestBodyDTO {

	private Long researcherProposalInfoId;
	private String formula;
	private String actionFor;
	private LocalDate newResearchStartDate;
	private LocalDate newResearchEndDate;
	private String newResearchDurationMonth;
	private Double newTotalGrantAmount;
	private String subject;
	private String details;
	private String status;

//	private ResearcherProposalInfo researcherProposalInfo;
	private ResearcherProposalResponseDto researcherProposal;
}
