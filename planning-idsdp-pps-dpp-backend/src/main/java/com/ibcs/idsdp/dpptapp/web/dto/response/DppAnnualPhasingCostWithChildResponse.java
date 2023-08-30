package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTabDetailsDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTotalDTO;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Setter
@Getter
public class DppAnnualPhasingCostWithChildResponse extends DppAnnualPhasingCostDTO {

    private List<FiscalYearWiseData> fiscalYearWiseCost;


}
