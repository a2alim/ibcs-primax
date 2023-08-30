package com.ibcs.idsdp.rpm.web.dto.request;

import java.time.LocalDate;
import java.util.Date;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ResearchActionRequestDto extends UuidIdHolderRequestBodyDTO{

	private PageableRequestBodyDTO pageableRequestBodyDTO;

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
}
