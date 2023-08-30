package com.ibcs.idsdp.dpptapp.web.dto;

import lombok.Data;


@Data
public class AnnualPhasingCostTotalDTO {
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
