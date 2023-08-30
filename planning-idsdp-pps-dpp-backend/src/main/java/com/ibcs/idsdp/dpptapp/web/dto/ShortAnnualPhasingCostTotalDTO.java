package com.ibcs.idsdp.dpptapp.web.dto;

import lombok.Data;

@Data
public class ShortAnnualPhasingCostTotalDTO {
    private Double gobAmount;
    private Double gobFeAmount;
    private Double ownFundAmount;
    private Double ownFundFeAmount;
    private Double otherAmount;
    private Double otherFeAmount;
    private Double totalAmount;
}
