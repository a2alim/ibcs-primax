package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;


@Data
public class YearWiseComponentWiseCostDTO {
	private String fiscalYear;
	private ComponentWiseCostDTO componentWiseCost;
}
