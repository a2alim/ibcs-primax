package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;


@Data
public class CostTabDetailsDTO {
	private String subEconomicCode;
	private String unitTypeCode;
	private Double unitCost;
	private Double qty;
	private Double total;
	private Double gob;
	private Double gobFe;
	private Double rpaThroughGob;
	private Double rpaSpecialAcc;
	private Double thruPd;
	private Double thruDp;
	private Double ownFund;
	private Double ownFundFe;
	private Double other;
	private Double otherFe;
}
