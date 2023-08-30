package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.EconomicCode;
import lombok.Data;

import javax.persistence.Column;

@Data
public class SubEconomicCodeRequest extends UuidIdHolderRequestBodyDTO {

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

    private EconomicCodeRequest economicCodeDTO;
}
