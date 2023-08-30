package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.web.dto.DppFiscalYearDTO;

import java.util.List;

public interface DppFiscalYearService {

    List<DppFiscalYearDTO> getByDppAnnualPhasingCostTabDetailsId(Long id);

    List<DppFiscalYearDTO> getByProjectConceptIdAndComponentName(Long conceptId, DppAnnualPhasing dppAnnualPhasing);

}
