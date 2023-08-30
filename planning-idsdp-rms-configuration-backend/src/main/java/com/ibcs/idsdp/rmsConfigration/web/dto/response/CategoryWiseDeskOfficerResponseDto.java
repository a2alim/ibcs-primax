package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import javax.validation.constraints.NotBlank;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;

import lombok.Data;

@Data
public class CategoryWiseDeskOfficerResponseDto extends UuidHolderRequestBodyDTO{
	
	@NotBlank
	private FiscalYear stFiscalYearId;	
	
	@NotBlank
	private ResearchCategoryType stResearchCategoryTypeId;
	
//	@NotBlank
//	private Long stFiscalYearId;	
//	@NotBlank
//	private Long stResearchCategoryTypeId;
	
	private Integer catWiseProfileMark;	
	private Integer catWiseProposalMark;
	private Boolean active;
	private Long userId;
}
