package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class SubEconomicCode extends UuidIdHolderRequestBodyDTO {

    private String code;

    private EconomicCode economicCodeId;

    private String oldSubEconomicCodeEn;

    private String oldSubEconomicCodeBn;

    private String subEconomicCode;

    private String subEconomicCodeBng;

    private String subEconomicCodeName;

    private String subEconomicCodeNameBng;

    private String description;

    private String descriptionBn;

    private Boolean status;

    private EconomicCode economicCodeDTO;
}
