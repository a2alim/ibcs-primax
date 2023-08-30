package com.ibcs.idsdp.rpm.web.dto.request;

import java.time.LocalDate;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ResearcherProposalActionPlanRequestDto  extends UuidIdHolderRequestBodyDTO{

	@NotBlank
	private Long researcherProposalId;

	@NotBlank
	private String taskName;
	private Integer totalDays;
	private LocalDate startDate;
	private LocalDate endDate;
	private String remarks;
	private Integer isDeleted;
//	private Integer researchPlanId;
	private Boolean isAgree;

	@NotBlank
	private Long catWiseActPlanId;
}
