package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import lombok.Data;

@Data
public class DevelopmentPartnerResponse {
    private Long id;
    private String code;
    private String developmentPartnerName;
    private String developmentPartnerNameBng;
    private String description;
    private Boolean status;
}
