package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

import javax.persistence.Column;

@Data
public class DevelopmentPatnerRequest extends UuidHolderRequestBodyDTO {

    private String code;
    private String developmentPartnerName;
    private String developmentPartnerNameBng;
    private String description;
    private Boolean status;
}
