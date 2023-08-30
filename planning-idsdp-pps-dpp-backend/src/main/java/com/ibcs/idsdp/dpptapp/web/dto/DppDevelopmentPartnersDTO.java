package com.ibcs.idsdp.dpptapp.web.dto;

import lombok.Data;

@Data
public class DppDevelopmentPartnersDTO {

    private Long id;
    private String uuid;
    private Long devPartnerId;
    private Long modeFinanceId;
    private Double gobThruAmount;
    private Double spAcAmount;
    private Double thruPdAmount;
    private Double thruDpAmount;
    private Long attachmentId;
}
