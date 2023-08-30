package com.ibcs.idsdp.rdpprtapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Setter
@Getter
public class TappAnnualPhasingCostDTO extends UuidIdHolderRequestBodyDTO {

    @NotNull
    private String projectConceptUuid;

    @NotNull
    private Long projectConceptId;

    @NotNull
    private Long rtappMasterId;

    @NotNull
    private DppAnnualPhasing componentName;

    private TappAnnualPhasingCostTotalDTO tappAnnualPhasingCostTotal;

    @NotEmpty
    private List<TappAnnualPhasingCostTabDetailsDTO> tappAnnualPhasingCostTabDetails;
}
