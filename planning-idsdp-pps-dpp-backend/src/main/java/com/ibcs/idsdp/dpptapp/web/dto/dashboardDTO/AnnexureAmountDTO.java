package com.ibcs.idsdp.dpptapp.web.dto.dashboardDTO;

import lombok.Data;

@Data
public class AnnexureAmountDTO {

    private Double totalAmount;
    private Double gobAmount;
    private Double gobFeAmount;
    private Double paAmount;
    private Double rpaAmount;
    private Double ownFundAmount;
    private Double ownFundFeAmount;
    private Double otherAmount;
    private Double otherFeAmount;
}
