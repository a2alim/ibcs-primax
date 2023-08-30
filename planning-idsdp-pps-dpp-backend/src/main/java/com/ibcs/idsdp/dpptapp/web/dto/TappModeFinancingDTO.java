package com.ibcs.idsdp.dpptapp.web.dto;

import lombok.Data;

@Data
public class TappModeFinancingDTO {
    private Long modId;
    private String modeUuid;

    private Double gobEA;
    private Double gobLocal;
    private Double gobFe;
    private Double gobTotal;
    private String gobSource;

    private Double developmentEA;
    private Double developmentLocal;
    private Double developmentFe;
    private Double developmentTotal;
    private String developmentSource;

    private Double ownFundEA;
    private Double ownFundLocal;
    private Double ownFundFe;
    private Double ownFundTotal;
    private String ownFundSource;

    private Double othersSpecifyEA;
    private Double othersSpecifyLocal;
    private Double othersSpecifyFe;
    private Double othersSpecifyTotal;
    private String othersSpecifySource;

    private Double grandTotalEa;
    private Double grandTotalLocal;
    private Double grandTotalFe;
    private Double grandTotalTotal;
}
