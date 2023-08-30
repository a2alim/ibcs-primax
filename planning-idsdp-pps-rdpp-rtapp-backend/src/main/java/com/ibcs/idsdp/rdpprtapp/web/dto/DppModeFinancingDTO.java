package com.ibcs.idsdp.rdpprtapp.web.dto;

import lombok.Data;

@Data
public class DppModeFinancingDTO {

    private Long modeId;
    private String modeSource;
    private String modeSourceVal;
    private Double gob;
    private Double gobFe;
    private Double pa;
    private Double paRpa;
    private Double ownFund;
    private Double ownFundFe;
    private Double others;
    private Double othersFe;
    private String paSources;
}
