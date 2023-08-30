package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class GisLocationDTO extends UuidIdHolderRequestBodyDTO {
    @NotNull
    private String divisionGeoCode;
    private String zillaGeoCode;
    private String upazilaGeoCode;
    @NotNull
    private Long projectConceptMasterId;
    @NotNull
    private Long sourceModuleId;
    @NotNull
    private String sourceModuleType;
}
