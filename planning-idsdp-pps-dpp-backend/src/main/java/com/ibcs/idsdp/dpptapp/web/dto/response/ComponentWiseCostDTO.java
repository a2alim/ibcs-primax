package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;
import java.util.List;


@Data
public class ComponentWiseCostDTO {
	private List<CostTabDetailsDTO> revenue;
	private List<CostTabDetailsDTO> capital;
	private CostTabDetailsDTO physicalContingency;
	private CostTabDetailsDTO priceContingency;
}
