package com.ibcs.idsdp.idsdpconfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.EconomicCode;
import lombok.Data;

@Data
public class SubEconomicCodeResponse extends UuidIdHolderRequestBodyDTO {

    private String code;

    private EconomicCode economicCodeId;

    private String subEconomicCode;

    private String subEconomicCodeBng;

    private String subEconomicCodeName;

    private String subEconomicCodeNameBng;

    private String description;

    private String descriptionBn;

    private Boolean status;
}
