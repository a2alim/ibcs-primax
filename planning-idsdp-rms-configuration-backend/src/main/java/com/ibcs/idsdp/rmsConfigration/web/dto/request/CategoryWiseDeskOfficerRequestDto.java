package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import javax.validation.constraints.NotBlank;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;

import lombok.Data;

@Data
public class CategoryWiseDeskOfficerRequestDto extends UuidIdHolderRequestBodyDTO{
	
	private FiscalYear stFiscalYearId;	
	private FiscalYear stResearchCategoryTypeId;
	
//	@NotBlank
//	private Long stFiscalYearId;
//	@NotBlank
//	private Long stResearchCategoryTypeId;
	private Integer catWiseProfileMark;	
	private Integer catWiseProposalMark;
	
	private Boolean active;
	private Long userId;

}
