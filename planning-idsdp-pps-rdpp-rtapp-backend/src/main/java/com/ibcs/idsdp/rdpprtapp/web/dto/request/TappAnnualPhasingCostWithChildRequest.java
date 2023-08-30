package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.rdpprtapp.web.dto.TappAnnualPhasingCostDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappAnnualPhasingCostTotalDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class TappAnnualPhasingCostWithChildRequest extends TappAnnualPhasingCostDTO {

    List<TappAnnualPhasingCostTotalDTO> fiscalYearsWiseTotal;
}
