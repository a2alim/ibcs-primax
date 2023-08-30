package com.ibcs.idsdp.idsdpconfigration.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class CategoryPerEnvironmentConservationRulesDTO extends UuidIdHolderRequestBodyDTO {

    private String code;
    private String categoryCode;
    private String categoryCodeName;
    private String categoryCodeNameBng;
    private String description;
    private Boolean status;
}
