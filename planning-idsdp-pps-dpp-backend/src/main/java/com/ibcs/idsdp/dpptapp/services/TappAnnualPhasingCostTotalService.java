package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.web.dto.TappAnnualPhasingCostTotalDTO;

import java.util.List;

public interface TappAnnualPhasingCostTotalService {

    List<TappAnnualPhasingCostTotalDTO> getByProjectConceptIdAndComponentName(Long conceptId, DppAnnualPhasing dppAnnualPhasing);

    TappAnnualPhasingCostTotalDTO getByProjectConceptIdAndComponentNameAndFiscalYear(Long conceptId, DppAnnualPhasing dppAnnualPhasing, String fiscalYear);

}
