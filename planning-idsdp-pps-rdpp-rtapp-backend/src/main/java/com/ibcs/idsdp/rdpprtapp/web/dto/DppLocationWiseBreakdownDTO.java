package com.ibcs.idsdp.rdpprtapp.web.dto;

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
    private Long rdppMasterId;

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

    private String divisionName;
    private String zillaName;
    private String upazilaName;
}
