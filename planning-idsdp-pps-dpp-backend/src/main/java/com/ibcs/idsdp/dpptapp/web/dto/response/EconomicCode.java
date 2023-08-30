package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class EconomicCode extends UuidIdHolderRequestBodyDTO {

    private String code;

    private Integer economicCodeFor;

    private String oldEconomicCodeEn;

    private String oldEconomicCodeBn;

    private String economicCode;

    private String economicCodeBng;

    private String economicCodeName;

    private String economicCodeNameBng;

    private String description;

    private String descriptionBn;

    private Boolean status;
}
