package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.web.dto.TappAnnualPhasingCostTabDetailsDTO;

import java.util.List;

public interface TappAnnualPhasingCostTabDetailsService {

    List<TappAnnualPhasingCostTabDetailsDTO> getByTappAnnualPhasingCostId(Long id);

}
