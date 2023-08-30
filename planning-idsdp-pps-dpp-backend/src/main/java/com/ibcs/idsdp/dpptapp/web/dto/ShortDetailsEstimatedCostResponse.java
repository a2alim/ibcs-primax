package com.ibcs.idsdp.dpptapp.web.dto;

import lombok.Data;

@Data
public class ShortDetailsEstimatedCostResponse {
	private ShortEstimatedCostTabDetailsDTO revenue;
	private ShortEstimatedCostTabDetailsDTO capital;
	private ShortEstimatedCostTabDetailsDTO physicalContingency;
	private ShortEstimatedCostTabDetailsDTO priceContingency;
	private ShortEstimatedCostTabDetailsDTO grandTotal;
}
