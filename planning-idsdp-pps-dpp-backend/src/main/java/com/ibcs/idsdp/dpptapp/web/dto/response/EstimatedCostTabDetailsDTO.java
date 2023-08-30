package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppFiscalYearDTO;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Setter
@Getter
public class EstimatedCostTabDetailsDTO extends UuidIdHolderRequestBodyDTO {

	private Long attachmentId;

	private Boolean isMajor;

	private Long dppAnnualPhasingCostId;

	private EconomicCode economicCode;

	private SubEconomicCode subEconomicCode;

	private String description;

	private UnitType unitType;

	private Double unitCost;

	private Double qty;

	private Double totalAmount;

	@NotNull
	private Double gobAmount;

	@NotNull
	private Double gobFeAmount;

	@NotNull
	private Double gobThruAmount;

	@NotNull
	private Double spAcAmount;

	@NotNull
	private Double thruPdAmount;

	@NotNull
	private Double thruDpAmount;

	@NotNull
	private Double ownFundAmount;

	@NotNull
	private Double ownFundFeAmount;

	@NotNull
	private Double otherAmount;

	@NotNull
	private Double otherFeAmount;

	private Double totalCostCalculated;

	private Double totalProjectCost;

	// for report
	private Double subUnitCost;
	private Double subQty;
	private Double subTotalAmount;
	private Double subGobAmount;
	private Double subGobFeAmount;
	private Double subGobThruAmount;
	private Double subSpAcAmount;
	private Double subThruPdAmount;
	private Double subThruDpAmount;
	private Double subOwnFundAmount;
	private Double subOwnFundFeAmount;
	private Double subOtherAmount;
	private Double subOtherFeAmount;
	private Double subTotalCostCalculated;
	private Double subTotalProjectCost;

}
