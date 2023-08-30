package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import com.ibcs.idsdp.rpm.client.dto.response.ExpenditureItemResponseDto;
import lombok.Data;

@Data
public class ResearcherProposalBudgetDetailsResponseDto  extends UuidIdHolderRequestBodyDTO{	
	
	private Long researcherProposalId;
	private Long stExpenditureItemId;
	private String purpose;
	private Double totalAmount;
	private Integer isEditable;
//	private String expenditureName;

	private ExpenditureItemResponseDto expenditureItem;
	private ResearcherProposalResponseDto researcherProposalDto;

}
