package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class EconomicCodeRequest extends UuidIdHolderRequestBodyDTO {

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
