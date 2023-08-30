package com.ibcs.idsdp.rdpprtapp.web.dto;

import lombok.Data;

@Data
public class TappDevelopmentPartnersDTO {

    private Long id;
    private String uuid;
    private Long devPartnerId;
    private Long modeFinanceId;
    private Double paTotalAmount;
    private Double rpaAmount;
    private Long attachmentId;
}
