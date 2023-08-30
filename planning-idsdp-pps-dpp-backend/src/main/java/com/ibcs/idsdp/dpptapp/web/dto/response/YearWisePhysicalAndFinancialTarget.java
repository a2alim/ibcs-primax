package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class YearWisePhysicalAndFinancialTarget extends UuidIdHolderRequestBodyDTO {


    private String projectConceptUuid;

    private Long projectConceptId;

    private DppAnnualPhasing componentName;

    List<DppAnnualPhasingCostDetails> details;
}
