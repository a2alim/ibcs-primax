package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class DppLocationWiseBreakdownDTO extends UuidIdHolderRequestBodyDTO {

    @NotNull
    private String projectConceptMasterUuid;

    @NotNull
    private Long projectConceptMasterId;

    @NotNull
    private Long dppMasterId;

    @NotNull
    private Long divisionId;

    @NotNull
    private Long zillaId;

    @NotNull
    private Long upazilaId;

    @NotNull
    private String quantity;

    @NotNull
    private Double estimatedCost;

    private String comment;
}
