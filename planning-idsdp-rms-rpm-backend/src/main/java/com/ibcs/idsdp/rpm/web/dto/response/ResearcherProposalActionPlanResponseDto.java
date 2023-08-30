package com.ibcs.idsdp.rpm.web.dto.response;

import java.time.LocalDate;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ResearcherProposalActionPlanResponseDto  extends UuidIdHolderRequestBodyDTO {
	private Long researcherProposalId;
	private String taskName;
	private Integer totalDays;
	private LocalDate startDate;
	private LocalDate endDate;
	private String remarks;
	private Integer isEditable;
	private Boolean isAgree;
	private Long catWiseActPlanId;
}
