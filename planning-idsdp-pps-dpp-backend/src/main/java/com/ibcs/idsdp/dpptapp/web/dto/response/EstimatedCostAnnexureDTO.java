package com.ibcs.idsdp.dpptapp.web.dto.response;

import java.util.List;
import java.util.Map;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTotalDTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class EstimatedCostAnnexureDTO extends UuidIdHolderRequestBodyDTO {

	@NotNull
	private String projectConceptUuid;

	@NotNull
	private Long projectConceptId;

	@NotNull
	private DppAnnualPhasing componentName;

	private DppAnnualPhasingCostTotalDTO dppAnnualPhasingCostTotal;

	@NotEmpty
	private List<EstimatedCostTabDetailsDTO> estimatedCostTabDetailsDTOS;

	private Map<Long, List<EstimatedCostTabDetailsDTO>> group;
	
}
