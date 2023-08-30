package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.dpptapp.web.dto.TappAnnualPhasingCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.TappAnnualPhasingCostTotalDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class TappAnnualPhasingCostWithChildRequest extends TappAnnualPhasingCostDTO {

    List<TappAnnualPhasingCostTotalDTO> fiscalYearsWiseTotal;
}
