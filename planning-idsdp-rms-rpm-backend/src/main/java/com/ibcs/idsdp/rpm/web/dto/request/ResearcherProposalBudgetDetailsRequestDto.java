package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class ResearcherProposalBudgetDetailsRequestDto extends UuidIdHolderRequestBodyDTO{

	@NotNull
	private Long researcherProposalId;

	@NotNull
	private Long stExpenditureItemId;

	private String purpose;

	@NotNull
	private Double totalAmount;

	private Integer isEditable;

	private Integer isDeleted;
	
	private String expenditureName;

}
