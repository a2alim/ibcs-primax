package com.ibcs.idsdp.dpptapp.web.dto;

import lombok.Data;

@Data
public class ShortModeFinancingDTO {
    private String modeFinanceCode;
    private Double gob;
    private Double gobFe;
    private Double pa;
    private Double paRpa;
    private Double ownFund;
    private Double ownFundFe;
    private Double other;
    private Double otherFe;
    private String paSourceCode;
}
