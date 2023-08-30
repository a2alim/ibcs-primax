package com.ibcs.idsdp.dpptapp.web.dto;

import lombok.Data;

@Data
public class ShortEstimatedCostTabDetailsDTO {
	private String description;
	private String unitTypeName;
	private Double unitCost;
	private Double qty;
	private Double gobAmount;
	private Double gobFeAmount;
	private Double ownFundAmount;
	private Double ownFundFeAmount;
	private Double otherAmount;
	private Double otherFeAmount;
	private Double totalAmount;
	private Double totalProjectCost;
}
