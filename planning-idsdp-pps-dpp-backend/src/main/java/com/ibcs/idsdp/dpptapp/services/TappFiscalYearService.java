package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.web.dto.TappFiscalYearDTO;

import java.util.List;

public interface TappFiscalYearService {

    List<TappFiscalYearDTO> getByTappAnnualPhasingCostTabDetailsId(Long id);

    List<TappFiscalYearDTO> getByProjectConceptIdAndComponentName(Long conceptId, DppAnnualPhasing dppAnnualPhasing);

}
