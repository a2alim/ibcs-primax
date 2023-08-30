package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.web.dto.TappAnnualPhasingCostDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class TappAnnualPhasingCostWithChildResponse extends TappAnnualPhasingCostDTO {

    private List<TappFiscalYearWiseData> fiscalYearWiseCost;


}
